import ReactMarkdown from 'react-markdown';

import { markdownComponents } from './markdown-components';

interface MarkdownRendererProps {
   content: string;
   isError?: boolean;
   className?: string;
}

export const MarkdownRenderer = ({
   content,
   isError,
   className = '',
}: MarkdownRendererProps) => {
   return (
      <ReactMarkdown
         children={(content as string) || ''}
         className={`${className} ${isError ? 'vscode-error-foreground' : ''}`}
         components={markdownComponents}
      />
   );
};
