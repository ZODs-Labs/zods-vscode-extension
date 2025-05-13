import { Uri } from 'vscode';

type StyleUri = string | Uri;

export interface WebViewConfig {
   id: string;
   title: string;
   scriptUri: string | Uri;
   styleUris?: StyleUri[];
   env?: {
      [key: string]: any;
   };
}
