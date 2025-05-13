/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

const esbuild = require('esbuild');
console.log('Building extension...');

const isProduction = process.env.NODE_ENV === 'production';

const define = isProduction
   ? {
        EXTENSION_VERSION: '"1.0.4"',
        API_URL: '"https://app.zods.io/api"',
        WEB_URL: '"https://app.zods.io"',
        LOGIN_WEB_URI: '"https://app.zods.io/auth/vscode?redirectUrl="',
     }
   : {
        EXTENSION_VERSION: '"1.0.4"',
        API_URL: '"http://localhost:5002/api"',
        WEB_URL: '"http://localhost:3000"',
        LOGIN_WEB_URI: '"http://localhost:3000/auth/vscode?redirectUrl="',
     };

define.IS_DEV = '""';

const baseOptions = {
   entryPoints: ['./src/index.ts'],
   bundle: true,
   outfile: 'out/index.js',
   external: ['vscode', 'node_modules/'],
   format: 'cjs',
   platform: 'node',
   define,
};
const buildForProduction = () => {
   esbuild
      .build({
         ...baseOptions,
         minify: true,
      })
      .catch(() => process.exit(1));
};

const buildForDevelopment = () => {
   const hasSourceMap = process.argv.includes('--sourcemap');

   esbuild
      .build({
         ...baseOptions,
         sourcemap: hasSourceMap,
      })
      .catch(() => process.exit(1));
};

if (isProduction) {
   buildForProduction();
} else {
   buildForDevelopment();
}
