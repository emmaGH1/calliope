# Calliope security and operating boundaries

Calliope's desk is a local hackathon control surface, not an internet-facing
service. It starts local child processes and reads a local Sibyl Memory store.

## Safe operating mode

- Run the desk on `localhost` only.
- Never commit `.env`, API keys, wallet signer keys, or generated memory/event files.
- Keep real ACP credentials out of the desk unless you intentionally want a live
  escrow experiment.
- Use the simulated hire port for ordinary development and recording.
- Use `npm run org -- reset --yes` only for the local demo database; it does not
  delete credentials.

## Current limitations

The demo API has no authentication, authorization, rate limiting, CSRF layer, or
multi-tenant isolation. It is not suitable for public deployment without an
additional security boundary. ACP signer keys can authorize transactions, so a
production version would need a separate signing service, explicit spend limits,
approval policies, and audit controls.

Sibyl values are reference data. Calliope displays provenance and uses the
configured role/QA path, but production use would still need content validation,
policy review, and stronger isolation between organizations.

## Reporting an issue

Do not publish credentials or sensitive memory contents in an issue. Reproduce
with the simulated port and a clean local database, then describe the smallest
reproduction and affected command or route.
