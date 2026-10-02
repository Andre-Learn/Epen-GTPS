# Epen GTPS Production

The public settings.js file has been removed. Its non-secret configuration is embedded into the hashed application bundle at build time.

Do not put API keys, passwords, tokens, or other secrets in the client configuration. Keep secrets in Vercel Environment Variables and server-side functions.
