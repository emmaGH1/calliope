import { resolveSibylServer } from "../memory/sibyl.js";

const launch = resolveSibylServer();
console.log(JSON.stringify({ ok: true, command: launch.command, args: launch.args }));
