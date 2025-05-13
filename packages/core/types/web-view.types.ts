import { Command, WebviewMessageType } from '../enums';

export interface WebviewMessage {
   type: WebviewMessageType;
}

export interface CommandWebviewMessage extends WebviewMessage {
   command: Command;
   data?: any;
}

export interface InternalCommandWebviewMessage extends WebviewMessage {
   internalCommand: string;
   data?: any;
}

export interface ApiRequestWebviewMessage extends WebviewMessage {
   route: string;
   method: 'get' | 'post' | 'put' | 'delete';
   data?: any;
}
