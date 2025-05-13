import { Text } from '@chakra-ui/react';

import CodeSnippetModalButton from './CodeSnippetModalButton';

interface CodeRefactoringModalButtonProps {
   label: string;
   code: string;
   icon: React.ReactNode;
}

const ChatCommandCodeModalButton = ({
   label,
   code,
   icon,
   ...otherProps
}: CodeRefactoringModalButtonProps) => {
   return (
      <CodeSnippetModalButton
         modalTitle={label}
         code={code}
         bg='gray.600'
         _hover={{ opacity: 0.9 }}
         px={5}
         py={2}
         rounded='md'
         gap={2}
         {...otherProps}
      >
         {icon}
         <Text fontSize='md'>{label}</Text>
      </CodeSnippetModalButton>
   );
};

export default ChatCommandCodeModalButton;
