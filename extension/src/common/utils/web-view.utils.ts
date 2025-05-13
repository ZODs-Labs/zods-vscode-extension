/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Uri } from 'vscode';

import { WebViewConfig } from '@models/providers/view';

export abstract class WebViewUtils {
   static getRootHtml(config: WebViewConfig): string {
      const { id, title, scriptUri, env } = config;

      const envVariablesScript = this.parseEnvVariablesAsScript(env);
      const fakeLocalStorageScript = this.getFakeLocalStorageScript();
      const styleTags =
         config.styleUris?.map((styleUri) => {
            return `<link rel="stylesheet" href="${styleUri}">`;
         }) || [];

      const styleTagsString = styleTags.join('\n');

      return `<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>${title}</title>
        ${fakeLocalStorageScript}
        ${styleTagsString}
        ${envVariablesScript}
		</head>
		<body>
		  <div id="root"></div>
		  <script>
			const vscode = acquireVsCodeApi();
			window.onload = function() {
			  vscode.postMessage({ command: 'webviewReady', data: '${id}' });
			  console.log('Initialized ${title} view.');
			};
		  </script>
		  <script src="${scriptUri}"></script>
		</body>
		</html>
	  `;
   }

   static parseEnvVariablesAsScript(env?: { [key: string]: any }): string {
      if (!env) {
         return '';
      }

      const envVariables = Object.keys(env).reduce((acc, key) => {
         const value = env[key];
         let parsedValue = value;
         if (value instanceof Uri) {
            parsedValue = `'${value.toString()}'`;
         } else if (typeof value === 'string') {
            parsedValue = `'${value}'`;
         } else {
            parsedValue = JSON.stringify(value);
         }
         // Make sure there is new line for each window set variable
         acc += ` window['zods']['${key}'] = ${parsedValue};`;
         return acc;
      }, '');

      return `<script>
	    window['zods'] = {}; 
	    ${envVariables}
	  </script>`;
   }

   /**
    * Returns a script that mocks the localStorage object.
    * This is needed because the webview does not have access to the localStorage object.
    *
    * We set the Chakra UI color mode to dark by default.
    * @returns
    */
   static getFakeLocalStorageScript(): string {
      return `
      <script>
         (function() {
            var localStorageShim = (function() {
               var store = {
                  'chakra-ui-color-mode': 'dark'
               };
               return {
                  getItem: function(key) {
                    return store[key] || null;
                  },
                  setItem: function(key, value) {
                    store[key] = value.toString();
                  },
                  removeItem: function(key) {
                    delete store[key];
                  },
                  clear: function() {
                    store = {};
                  }
               };
            })();
      
            Object.defineProperty(window, 'localStorage', {
               value: localStorageShim
            });
         })();
      </script>
      `;
   }
}
