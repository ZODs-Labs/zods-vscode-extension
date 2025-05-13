import { useRef } from 'react';

import {
   Box,
   Button,
   ButtonProps,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   useDisclosure,
} from '@chakra-ui/react';

import { FileTreeItem } from '@zods/core';

import { TreeFilesView } from './TreeFilesView';

interface Props extends ButtonProps {
   title: string;
   filesTree: FileTreeItem[];
   onItemSelect: (item: FileTreeItem) => void;
}

export const FileSelectorModal = ({
   title,
   filesTree,
   children,
   onItemSelect,
   ...otherProps
}: Props) => {
   const btnRef = useRef<HTMLButtonElement>(null);

   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleItemSelect = (item: FileTreeItem) => {
      onItemSelect(item);
      onClose();
   };

   return (
      <Box>
         <Button ref={btnRef} onClick={onOpen} {...otherProps}>
            {children}
         </Button>
         <Modal
            onClose={onClose}
            isOpen={isOpen}
            scrollBehavior='inside'
            finalFocusRef={btnRef}
            isCentered
            size='4xl'
         >
            <ModalOverlay />
            <ModalContent
               h='80%'
               w='600px'
               maxW='90%'
               bg='var(--vscode-textPreformat-background)'
            >
               <ModalHeader>{title}</ModalHeader>
               <ModalCloseButton />

               <ModalBody pt={5}>
                  {isOpen && (
                     <TreeFilesView
                        data={filesTree}
                        onItemClick={handleItemSelect}
                     />
                  )}
               </ModalBody>
               <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </Box>
   );
};
