# wfirma-sdk

[![npm version](https://img.shields.io/npm/v/wfirma-sdk)](https://www.npmjs.com/package/wfirma-sdk)

TypeScript SDK for the [wFirma.pl API](https://doc.wfirma.pl/), generated from the official Postman collection.

## Installation

```bash
npm install wfirma-sdk
```

## Authentication

Create API keys in wFirma: **Settings → Security → Applications → API Keys**. You need `accessKey`, `secretKey`, and an integration `appKey` ([docs](https://doc.wfirma.pl/#autoryzacja)).

```typescript
import { WFirmaClient, createWFirmaModules } from "wfirma-sdk";

const client = new WFirmaClient({
  credentials: {
    accessKey: process.env.WFIRMA_ACCESS_KEY!,
    secretKey: process.env.WFIRMA_SECRET_KEY!,
    appKey: process.env.WFIRMA_APP_KEY!,
  },
  companyId: process.env.WFIRMA_COMPANY_ID,
});

const api = createWFirmaModules(client);
```

## Usage

### Invoices (typed module)

```typescript
const invoice = await api.invoices.add({
  type: "normal",
  contractor: { name: "Acme Sp. z o.o.", nip: "5252525252" },
});

const found = await api.invoices.find();
const one = await api.invoices.get(123);
await api.invoices.send(123);
```

### Any resource from the Postman collection

All resources from [doc.wfirma.pl](https://doc.wfirma.pl/) are available via `resource()`:

```typescript
await api.resource("contractors").add({
  name: "Kontrahent",
  zip: "00-001",
  country: "PL",
  nip: "1111111111",
});

await api.resource("goods").find({ limit: 20, page: 1 });
await api.resource("payments").get(99);
```

Supported resources include `contractors`, `invoices`, `goods`, `payments`, `expenses`, `documents`, `webhooks`, warehouse document types, and more. Run `bun run generate:modules` after syncing the collection to refresh definitions.

## XML payloads

The API uses XML by default. The SDK builds and parses XML automatically. Pass a plain object for `add` / `edit`; it is wrapped in the correct `<api><resource>…</resource></api>` structure.

For full control, pass a raw XML string as `body` to `client.request()`.

## Documentation

Full docs are in [`docs/`](./docs/) ([Fumadocs](https://www.fumadocs.dev/docs) + Next.js).

```bash
npm run docs:dev    # http://localhost:3000/docs
npm run docs:build
```

## Development

Built with [Vite](https://vite.dev/) library mode (ESM + CJS). XML requests use [`fast-xml-builder`](https://www.npmjs.com/package/fast-xml-builder); responses are parsed with [`fast-xml-parser`](https://www.npmjs.com/package/fast-xml-parser).

This project uses [Bun](https://bun.sh/) for installs, scripts, and running TypeScript tooling.

### Local playground (no build / npm publish)

Copy `.env.example` to `.env` and set `ACCESS_KEY`, `SECRET_KEY`, and `APP_KEY`. Bun loads `.env` automatically.

```bash
bun install
bun run dev                    # smoke test against live API (imports ../src)
bun run dev contractors find   # call a specific resource
bun run dev invoices get 123   # get by id
```

`bun run dev` uses `--watch` and reloads when you edit SDK source under `src/`.

```bash
bun run sync:postman    # download latest collection from doc.wfirma.pl
bun run generate:modules
bun run build           # only needed before publishing
bun run build:watch     # watch dist for library consumers
bun test
bun run typecheck
```

## License

MIT
