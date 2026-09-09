export interface OrgEvent {
  ts: string;
  pid: number;
  kind:
    | "boot"
    | "founded"
    | "reconstituted"
    | "vendor"
    | "decision"
    | "deliverable"
    | "ruling"
    | "hire-port"
    | "wipe"
    | "obligation";
  text: string;
  data?: any;
}
