import { useRef } from 'react';

import {
   Button,
   ButtonProps,
   Flex,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   useDisclosure,
} from '@chakra-ui/react';

import HighLightedCode from '../HighlightedCode';

export interface CodeSnippetModalButtonProps extends ButtonProps {
   modalTitle: string;
   code: string;
}

const CodeSnippetModalButton = ({
   modalTitle,
   code,
   children,
   ...otherProps
}: CodeSnippetModalButtonProps) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const codeCtxBtnRef = useRef<HTMLButtonElement>(null);

   return (
      <Flex>
         <Button ref={codeCtxBtnRef} onClick={onOpen} {...otherProps}>
            {children}
         </Button>
         <Modal
            onClose={onClose}
            isOpen={isOpen}
            scrollBehavior='inside'
            finalFocusRef={codeCtxBtnRef}
            isCentered
            size='4xl'
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>{modalTitle}</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  {isOpen && (
                     <HighLightedCode code={code} language='typescript' />
                  )}
               </ModalBody>
               <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </Flex>
   );
};

export default CodeSnippetModalButton;
