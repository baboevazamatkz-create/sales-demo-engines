#!/usr/bin/env node
// Builds a single-client bundle that boots straight into one client's
// engine, skipping the gallery — this is what a native Capacitor build or
// a per-client static deploy (e.g. one link per customer) should use.
// Usage:
//   npm run build:client -- --id polyn-cafe [--base /polyn-cafe/]
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
      args[key] = value;
      if (value !== true) i += 1;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const clientId = args.id;

if (!clientId) {
  console.error('\n✖ --id is required\n');
  console.error('Usage: npm run build:client -- --id <client-id> [--base /path/]');
  process.exit(1);
}

const configPath = path.join(ROOT, 'src/clients', clientId, 'config.json');
if (!existsSync(configPath)) {
  console.error(`\n✖ No config at src/clients/${clientId}/config.json\n`);
  process.exit(1);
}

const outDir = path.join('dist-clients', clientId);
const result = spawnSync('npx', ['vite', 'build', '--outDir', outDir], {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_CLIENT: clientId,
    ...(args.base ? { VITE_BASE: String(args.base) } : {}),
  },
});

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`\n✓ Built ${outDir} — a self-contained demo for "${clientId}" (no gallery, boots straight into the client).`);
