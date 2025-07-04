import { createExportableManifest, type MakePublishManifestOptions } from "@pnpm/exportable-manifest";
import { readProjectManifestOnly } from "@pnpm/read-project-manifest";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

async function isWorkspacePackage(pkgDir: string): Promise<boolean> {
  try {
    const m = await readProjectManifestOnly(pkgDir);
    return !!(m.name && m.version);
  } catch {
    return false;
  }
}

async function processPackage(pkgDir: string) {
  const manifest = await readProjectManifestOnly(pkgDir);

  // Add the mandatory opts param with empty catalogs
  const opts: MakePublishManifestOptions = {
    catalogs: {} as any,
  };

  // Create the exportable manifest to be written as a package.json
  // This one contains the workspace dependencies with concrete versions
  const exportable = await createExportableManifest(pkgDir, manifest, opts);

  const distDir = path.join(pkgDir, "dist");
  await mkdir(distDir, { recursive: true });
  await writeFile(path.join(distDir, "package.json"), JSON.stringify(exportable, null, 2));
  console.log(`Success: exported manifest for '${manifest.name}' to '${distDir}/package.json'`);
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.length === 0) {
    console.error("Error: provide one or more package directories (relative to repo root)");
    process.exit(1);
  }

  for (const dir of inputs) {
    const abs = path.resolve(dir);
    if (!(await isWorkspacePackage(abs))) {
      console.warn(`Warning: Skipped '${abs}': not a valid workspace package`);
      continue;
    }
    await processPackage(abs);
  }
}

main().catch(err => {
  console.error("Unhandled Error: ", err);
  process.exit(1);
});
