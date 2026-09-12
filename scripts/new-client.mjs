#!/usr/bin/env node
// Scaffolds a new client by copying a niche template into src/clients/<id>.
// Usage:
//   npm run new-client -- --niche cafe-restaurant --id my-cafe --name "Кофейня Х"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NICHES = ['cafe-restaurant', 'retail', 'delivery'];

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

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  console.error('Usage: npm run new-client -- --niche <cafe-restaurant|retail|delivery> --id <client-id> [--name "Название"]');
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const niche = args.niche;
const clientId = args.id;
const displayName = args.name;

if (!niche || !NICHES.includes(niche)) fail(`--niche must be one of: ${NICHES.join(', ')}`);
if (!clientId || !/^[a-z0-9-]+$/.test(clientId)) fail('--id is required and must be lowercase-kebab-case (a-z, 0-9, -)');

const templatePath = path.join(ROOT, 'src/clients/_templates', niche, 'config.json');
const targetDir = path.join(ROOT, 'src/clients', clientId);
const targetPath = path.join(targetDir, 'config.json');
const assetsDir = path.join(ROOT, 'public/clients', clientId);

if (!existsSync(templatePath)) fail(`No template found at ${templatePath}`);
if (existsSync(targetPath)) fail(`src/clients/${clientId}/config.json already exists`);

const config = JSON.parse(readFileSync(templatePath, 'utf8'));
config.clientId = clientId;
if (displayName) config.business.name = displayName;

mkdirSync(targetDir, { recursive: true });
writeFileSync(targetPath, `${JSON.stringify(config, null, 2)}\n`);
mkdirSync(assetsDir, { recursive: true });

console.log(`\n✓ Created src/clients/${clientId}/config.json (niche: ${niche})`);
console.log(`✓ Created public/clients/${clientId}/ for logo/photo assets`);
console.log('\nNext steps:');
console.log(`  1. Edit src/clients/${clientId}/config.json — name, categories, items/products, theme colors.`);
console.log(`  2. Drop the client's logo/photos into public/clients/${clientId}/ and reference them as`);
console.log(`     "/clients/${clientId}/logo.png" in the config (logoUrl / imageUrl / images).`);
console.log(`  3. Preview: npm run dev, then open /?client=${clientId}`);
console.log(`  4. Ship a dedicated build: VITE_CLIENT=${clientId} npm run build\n`);
