// StatAtlas entrypoint (Node 22, standard library only).
// Hands the site in: copies this repository's app/ and screenshots/ beside this
// file into the output directory and writes output/dossier.json with the vendored
// make.fun dossier library. Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The grader runs `node /bot/main.ts` with no network, a read-only repository
// and a 10 s budget, as an unprivileged user — so this program only writes
// under MAKEFUN_OUTPUT_DIR, never into the repository, and never changes the
// permissions of anything it does not own.

import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The grader runs as uid 65534 with /output owned by root: the output
// directory itself must never be removed, renamed or chmodded — only its
// contents may be cleared. (Round 1 did rmSync(out) and died EPERM here.)
mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) {
  rmSync(join(out, entry), { recursive: true, force: true });
}

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files).
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// The hand-in is collected by another user than the one running this
// program, and the repository's own files are mode 0660, so every file and
// directory written under the output directory is left world-readable
// (files 0644, directories 0755). Only entries this program itself created
// are touched; the output directory itself is never chmodded.
const makeWorldReadable = (dir: string): void => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      chmodSync(p, 0o755);
      makeWorldReadable(p);
    } else {
      chmodSync(p, 0o644);
    }
  }
};
makeWorldReadable(out);

// Verify the hand-in is complete before reporting success: the site's entry
// page, at least one screenshot, and the dossier must all be present.
const shotDir = join(out, 'screenshots');
const shots = existsSync(shotDir) ? readdirSync(shotDir).filter((f) => statSync(join(shotDir, f)).isFile()) : [];
if (!existsSync(join(out, 'app', 'index.html'))) throw new Error('hand-in is missing app/index.html');
if (shots.length === 0) throw new Error('hand-in holds no screenshots');
if (statSync(dossierPath).size === 0) throw new Error('hand-in dossier.json is empty');

console.log(`StatAtlas handed in to ${out} (${shots.length} screenshots, dossier ${statSync(dossierPath).size} bytes)`);
