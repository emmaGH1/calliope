const nextConfig = {
  async redirects() {
    // The console spawns local agent processes + the Sibyl MCP server, so it
    // only runs where Calliope runs: the operator's machine. On a hosted
    // static deploy, point "Open console" at the run-it-locally instructions.
    return process.env.CALLIOPE_STATIC_DEPLOY
      ? [
          {
            source: "/console",
            destination: "https://github.com/emmaGH1/calliope#run-the-local-site-and-console",
            permanent: false,
          },
        ]
      : [];
  },
};

export default nextConfig;
