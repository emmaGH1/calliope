import { AcpAgent, PrivyAlchemyEvmProviderAdapter, AssetToken } from "@virtuals-protocol/acp-node-v2";
import { base } from "@account-kit/infra";
import { SimHirePort } from "./hire.js";
import type { HirePort } from "./hire.js";
import type { VendorRecord } from "./types.js";

/**
 * ACP hire port: real Agent Commerce Protocol jobs (escrow + payment on
 * Base) once agents are registered. The Calliope desk agent acts as the
 * buyer/client; the vendor book entry's walletAddress/offeringName are the
 * provider. UNTESTED until registration env exists — SimHirePort remains
 * the default until then (env-gated below, never silently mixed).
 *
 * Env required (per registered agent page on app.virtuals.io/acp):
 *   CALLIOPE_WALLET_ADDRESS  CALLIOPE_WALLET_ID
 *   CALLIOPE_SIGNER_KEY      CALLIOPE_BUILDER_CODE (optional)
 *   VENDOR_WALLET_ADDRESS   VENDOR_OFFERING_NAME
 */
export class AcpHirePort implements HirePort {
  readonly label = "ACP(escrow on Base)";

  async hire(vendor: VendorRecord, req: { task: string; standards: string[] }) {
    const walletAddress = process.env.CALLIOPE_WALLET_ADDRESS;
    const walletId = process.env.CALLIOPE_WALLET_ID;
    const signerPrivateKey = process.env.CALLIOPE_SIGNER_KEY;
    const providerAddress = vendor.walletAddress ?? process.env.VENDOR_WALLET_ADDRESS;
    const offeringName = vendor.offeringName ?? process.env.VENDOR_OFFERING_NAME;
    if (!walletAddress || !walletId || !signerPrivateKey || !providerAddress || !offeringName) {
      throw new Error("AcpHirePort: registration env missing (see code comment). Falling back is the caller's job.");
    }

    const agent = await AcpAgent.create({
      evmProvider: await PrivyAlchemyEvmProviderAdapter.create({
        walletAddress: walletAddress as `0x${string}`,
        walletId,
        signerPrivateKey,
        chains: [base],
        ...(process.env.CALLIOPE_BUILDER_CODE
          ? { builderCode: process.env.CALLIOPE_BUILDER_CODE }
          : {}),
      }),
    });

    return new Promise<{ deliverable: string; spend: number; tx?: string }>(
      async (resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("AcpHirePort: job timed out waiting for completion")),
          180_000
        );
        let submitted: { content: string } | null = null;
        let funded = false;

        agent.on("entry", async (session: any, entry: any) => {
          try {
            if (entry.kind === "message") {
              // requirement arrives first; submit carries the deliverable
              if (entry.contentType === "submit") submitted = { content: entry.content };
            }
            if (entry.kind !== "system") return;
            switch (entry.event.type) {
              case "budget.set":
                await session.fund(AssetToken.usdc(vendor.rate, session.chainId));
                funded = true;
                break;
              case "job.submitted":
                if (funded) await session.complete("passes charter standards");
                break;
              case "job.completed":
                clearTimeout(timer);
                await agent.stop();
                resolve({
                  deliverable: submitted?.content ?? "(deliverable not captured — see session entries)",
                  spend: vendor.rate,
                  tx: `job ${session.jobId}`,
                });
                break;
              case "job.rejected":
              case "job.expired":
                clearTimeout(timer);
                await agent.stop();
                reject(new Error(`AcpHirePort: job ${entry.event.type}`));
                break;
            }
          } catch (e) {
            clearTimeout(timer);
            await agent.stop();
            reject(e as Error);
          }
        });

        try {
          await agent.start();
          const jobId = await agent.createJobByOfferingName(
            base.id,
            offeringName,
            providerAddress,
            {
              task: req.task,
              standards: req.standards,
            },
            { evaluatorAddress: walletAddress }
          );
          // keep the agent alive for the event loop above
        } catch (e) {
          clearTimeout(timer);
          await agent.stop();
          reject(e as Error);
        }
      }
    );
  }
}

/** Env-gated factory: real ACP only when registration is configured. */
export function hirePortForEnv(): { port: HirePort; real: boolean } {
  const ready = !!(
    process.env.CALLIOPE_WALLET_ADDRESS &&
    process.env.CALLIOPE_WALLET_ID &&
    process.env.CALLIOPE_SIGNER_KEY &&
    process.env.VENDOR_WALLET_ADDRESS
  );
  return ready ? { port: new AcpHirePort(), real: true } : { port: new SimHirePort(), real: false };
}
