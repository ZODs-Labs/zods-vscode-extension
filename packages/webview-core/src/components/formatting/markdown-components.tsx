import {
   Box,
   Code,
   Divider,
   Image,
   Link,
   ListItem,
   OrderedList,
   Table,
   Td,
   Text,
   Th,
   Tr,
   UnorderedList,
} from '@chakra-ui/react';

import CodeBlock from './CodeBlock';

export const markdownComponents = {
   h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h1'
         mt={5}
         pb={3}
         fontSize={['xl', '3xl']}
         fontWeight='bold'
         lineHeight='shorter'
         {...props}
      />
   ),
   h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h2'
         mt={5}
         pb={2}
         fontSize={['lg', 'xl', '2xl']}
         fontWeight='semibold'
         lineHeight='shorter'
         {...props}
      />
   ),
   h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h3'
         mt={5}
         pb={2}
         fontSize={['lg', 'xl']}
         fontWeight='semibold'
         lineHeight='shorter'
         {...props}
      />
   ),
   h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h4'
         mt={5}
         pb={2}
         fontSize={'xl'}
         fontWeight='semibold'
         lineHeight='shorter'
         {...props}
      />
   ),
   h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h5'
         mt={4}
         fontSize={'lg'}
         fontWeight='semibold'
         lineHeight='shorter'
         {...props}
      />
   ),
   h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Text
         as='h6'
         mt={4}
         pb={2}
         fontSize={'md'}
         fontWeight='semibold'
         lineHeight='shorter'
         {...props}
      />
   ),
   a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
      <Link
         fontWeight='medium'
         style={{
            textDecorationColor: 'var(--vscode-textLink-foreground)',
            textUnderlineOffset: '0.25rem',
         }}
         {...props}
      />
   ),
   p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <Text as='p' {...props} />
   ),
   ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <UnorderedList my={3} ml={4} styleType='disc' {...props} />
   ),
   ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <OrderedList my={3} ml={4} styleType='decimal' {...props} />
   ),
   li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <ListItem mt={2} {...props} />
   ),
   blockquote: (props: any) => (
      <Text
         as='blockquote'
         mt={6}
         pl={6}
         textStyle='italic'
         borderLeftWidth={2}
         {...props}
      />
   ),
   img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <Image rounded='md' border={1} alt={alt} {...props} />
   ),
   hr: ({ ...props }) => <Divider my={[4, 8]} {...props} />,
   table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <Box my={4} w='full' overflowY='auto'>
         <Table w='full' {...props} />
      </Box>
   ),
   tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
      <Tr
         m={0}
         p={0}
         borderTop={1}
         _even={{
            bg: 'gray.50',
         }}
         {...props}
      />
   ),
   th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <Th
         border={1}
         px={3}
         py={2}
         textAlign='left'
         fontWeight='bold'
         {...props}
      />
   ),
   td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <Td border={1} px={3} py={2} textAlign='left' {...props} />
   ),
   pre: (props: any) => (
      <Text
         as='pre'
         mb={2}
         mt={2}
         overflowX='auto'
         rounded='lg'
         border={1}
         bg='black'
         pb={1}
         {...props}
      />
   ),
   code: ({ className, children }: React.HTMLAttributes<HTMLPreElement>) => {
      // Extract the language from the className
      const match = /language-(\w+)/.exec(className || '');

      // Use the provided language, or fallback to "plaintext"
      // This is to cover case for markdown code blocks
      // where language is not specified and it should be plaintext by default
      const language = match ? match[1] : 'plaintext';

      if (!language || language === 'plaintext') {
         return (
            <Code paddingX='7px' borderRadius='4px'>
               {children}
            </Code>
         );
      }

      return (
         <CodeBlock
            language={language || 'typescript'}
            value={String(children).replace(/\n$/, '')}
         />
      );
   },
};
