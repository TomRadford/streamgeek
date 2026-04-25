read the readme buddy
also MAKE sure you used fnm install and corepack enable to ensure you're on the right node version!

Codex shells may inherit a stale fnm multishell PATH. After running `fnm install`
and `corepack enable`, verify `node -v` matches `.nvmrc`. If it does not, run
Node/pnpm commands through `fnm exec --using=$(cat .nvmrc) ...` so commands use
the repo's configured Node version.
