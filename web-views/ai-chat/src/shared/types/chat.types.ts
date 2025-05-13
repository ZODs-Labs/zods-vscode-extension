import { ChatMessageType } from '../enums/chat-message-type.enum';

export interface Message {
   content: string | React.ReactNode;
   type: ChatMessageType;
   isError?: boolean;
   key?: string;
}

export interface CodeCompletionPrompt {
   prompt: string;
   aiModel: boolean;
   fileExtension?: string;
   contextCode?: string;
}
