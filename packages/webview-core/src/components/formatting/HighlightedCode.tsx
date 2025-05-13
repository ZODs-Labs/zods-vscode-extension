import { useMemo } from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

import hljs from 'highlight.js';

export const HighLightedCode = ({
   code,
   language = 'typescript',
   ...props
}: {
   code: string;
   language: string;
} & BoxProps) => {
   const highlightedCode = useMemo(() => {
      // Assuming `code` is the code to highlight and `language` is the language of the code.
      // You can specify the language for better highlighting, or let highlight.js auto-detect it.
      try {
         // Try highlighting with the provided language
         return hljs.highlight(code, { language }).value;
      } catch (error) {
         return hljs.highlight(code, { language: 'javascript' }).value;
      }
   }, [code, language]);

   return (
      <Box {...props}>
         <pre
            style={{
               padding: '1rem',
            }}
         >
            <code
               className='zods-ai-code'
               dangerouslySetInnerHTML={{ __html: highlightedCode || '' }}
            />
         </pre>
      </Box>
   );
};
