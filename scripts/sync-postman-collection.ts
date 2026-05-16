import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const COLLECTION_URL =
  "https://doc.wfirma.pl/api/collections/10072824/UVJfkvxJ?segregateAuth=true&versionTag=latest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "../postman/collection.json");

const sync = async () => {
  const response = await fetch(COLLECTION_URL);

  if (!response.ok) {
    throw new Error(`Failed to download collection: HTTP ${response.status}`);
  }

  const json = await response.text();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, json);

  console.log(`Saved Postman collection (${json.length} bytes) to ${outputPath}`);
};

sync().catch((error) => {
  console.error(error);
  process.exit(1);
});
