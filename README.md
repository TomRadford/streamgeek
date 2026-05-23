# StreamGeek

## [Watch the demo!](https://video.rad.gdn/video/QZUWFxlOsIh)

Easy (mostly free) cloudflare-backed video streaming for the homies 🎥

- User authentication
- Adaptive bitrate streaming (via HLS)
- Edge caching
- FREE egress (thanks cloudflare R2!)

## Setup / Deployment

Get going with your own video hosting quick n' easy!

### Prerequisits

- A **cloudflare account with a domain**
- A **computer/server/vps** for transcoding agent with Docker installed and a public https reverse proxy

### Stack 
- rwsdk 🔥
- database (Prisma via D1)
- Auth (better auth)
- Storage (via R2) - free egress!
- Transcoding agents (node + ffmpeg + docker)

### Wrangler Setup

Within your project's `wrangler.jsonc`:

- Replace the `__change_me__` placeholders with a name for your application

- Create a new D1 database:

```shell
pnpx wrangler d1 create my-project-db
```

Copy the database ID provided and paste it into your project's `wrangler.jsonc` file:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-project-db",
      "database_id": "your-database-id"
    }
  ]
}
```

## Development

### First things first 🚀

Copy the example env to env.local:

```bash
cp .env.example .env
```

Ensure you have [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) installed

Install the node version:

```bash

nvm install

# OR

fnm install

```

Enable pnpm:

```bash

corepack enable

```

🛑 STOP 👉 Ensure that you're using `pnpm` and NOT any other package manager 🤭

Then, install deps:

```bash
pnpm i
```

### Running the main app

```shell
pnpm run dev
```

## Minio 

Emulate object storage locally with Minio, make sure S3 ACCESS and KEY env variables match MINIO_ROOT user and password in minio compose file:

```
pnpm run minio:up
```

Note that we use this instead of the R2 binding directly (ie: env.R2) because the agent app would not have access to this binding (hence S3 api)

### Running the agent app

Install ffmpeg on your system

```shell
brew install ffmpeg
```

Copy .env.dev.example to .env in the `/src/agent` route

```bash
cp .env.dev.example .env
```

Get cookin!

```shell
pnpm run agent:dev
```
