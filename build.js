import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.mjs',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
});

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.cjs',
  format: 'cjs',
  target: 'es2016',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
});

// esbuild src/index.ts --outfile=dist/index.mjs --format=esm --bundle --target=es2020 --external:node_modules/* --platform=node --sourcemap",
// "build:cjs": "esbuild src/index.ts --outfile=dist/index.cjs --format=cjs --bundle --target=es2016 --external:node_modules/* --platform=node --sourcemap",
