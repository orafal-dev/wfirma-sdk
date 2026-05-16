/**
 * Local dev playground — imports SDK from ../src (no build / npm publish needed).
 * Bun loads .env from the project root automatically.
 *
 * Usage:
 *   bun run dev
 *   bun run dev contractors find
 *   bun run dev invoices get 123
 */
import {
  WFirmaClient,
  createWFirmaModules,
  type ResourceAction,
  type ResourceName,
} from "../src/index.js";
import { loadDevEnv } from "./load-env.js";

const printUsage = () => {
  console.log(`
wFirma SDK dev playground (source mode)

  bun run dev                          smoke test: contractors + invoices find
  bun run dev <resource> find            e.g. contractors find
  bun run dev <resource> get <id>        e.g. invoices get 42
  bun run dev <resource> <action> [id]   any action from the Postman collection

Requires .env with ACCESS_KEY, SECRET_KEY, APP_KEY (optional: COMPANY_ID)
`.trim());
};

const printJson = (label: string, value: unknown) => {
  console.log(`\n── ${label} ──`);
  console.log(JSON.stringify(value, null, 2));
};

const runSmokeTest = async (api: ReturnType<typeof createWFirmaModules>) => {
  console.log("Running smoke test (read-only)…\n");

  const contractors = await api.resource("contractors").find(
    { limit: 3, page: 1 },
    {},
  );
  printJson("contractors.find (limit 3)", contractors.data);

  const invoices = await api.invoices.find();
  printJson("invoices.find", invoices.data);

  console.log("\nSmoke test finished.");
};

const runCli = async (
  api: ReturnType<typeof createWFirmaModules>,
  args: string[],
) => {
  if (args.length === 0) {
    await runSmokeTest(api);
    return;
  }

  if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    return;
  }

  const [resource, action, id] = args;
  if (!resource || !action) {
    printUsage();
    process.exit(1);
  }

  const client = api.resource(resource as ResourceName);
  const response = await client.invoke(action as ResourceAction, {
    id: id !== undefined ? id : undefined,
    query:
      action === "find"
        ? { limit: 5, page: 1 }
        : undefined,
  });

  printJson(`${resource}.${action}${id ? ` ${id}` : ""}`, {
    status: response.status,
    data: response.data,
  });
};

const main = async () => {
  const args = Bun.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args[0] === "help") {
    printUsage();
    return;
  }

  const env = loadDevEnv();
  const client = new WFirmaClient({
    credentials: {
      accessKey: env.accessKey,
      secretKey: env.secretKey,
      appKey: env.appKey,
    },
    companyId: env.companyId,
    baseUrl: env.baseUrl,
  });

  const api = createWFirmaModules(client);

  console.log("wFirma SDK dev");
  console.log(`  baseUrl:   ${client.baseUrl}`);
  console.log(`  companyId: ${env.companyId ?? "(not set)"}`);
  console.log(`  source:    ../src (no dist build)\n`);

  try {
    await runCli(api, args);
  } catch (error) {
    console.error("\nRequest failed:");
    if (error instanceof Error) {
      console.error(error.message);
      if ("code" in error && error.code) {
        console.error(`  api code: ${String(error.code)}`);
      }
      if ("rawBody" in error && typeof error.rawBody === "string") {
        console.error("\nRaw response:\n", error.rawBody.slice(0, 2000));
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

main();
