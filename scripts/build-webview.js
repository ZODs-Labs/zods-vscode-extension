const esbuild = require('esbuild');

const buildWebView = (entry, out) => {
   const buildOpts = {
      entryPoints: [entry],
      bundle: true,
      platform: 'browser',
      outfile: out,
      external: ['vscode'],
      loader: {
         '.tsx': 'tsx',
         '.ts': 'ts',
         '.scss': 'css',
      },
      define: {
         'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` || '"development"',
      },
   };

   esbuild
      .build(buildOpts)
      .then(() => {
         console.log('\x1b[32m%s\x1b[0m', 'Web view built successfully');
      })
      .catch(() => {
         console.error('Failed to build web view');
         process.exit(1);
      });
};

const argumentIndex = process.argv.findIndex((arg) =>
   arg.includes('--webview')
);

const webView = process.argv[argumentIndex + 1 || -1];

if (!webView) {
   console.error('No --webview option provided');
   process.exit(1);
}

console.log(`Starting ${webView} web view build...`);

const webViewEntires = {
   aiChat: {
      entry: './src/index.tsx',
      out: '../../extension/out/views/web/ai-chat/index.js',
   },
   testStorm: {
      entry: './src/index.tsx',
      out: '../../extension/out/views/web/test-storm/index.js',
   },
};

switch (webView) {
   case 'ai-chat':
      buildWebView(webViewEntires.aiChat.entry, webViewEntires.aiChat.out);
      break;
   case 'test-storm':
      buildWebView(
         webViewEntires.testStorm.entry,
         webViewEntires.testStorm.out
      );
}
