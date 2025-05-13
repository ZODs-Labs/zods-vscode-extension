import React, { useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Text, Icon, Flex } from '@chakra-ui/react';

import { FileCode, FolderIcon } from 'lucide-react';

import { FileTreeItem, FileType } from '@zods/core';

export interface TreeItemProps {
   treeItem: FileTreeItem;
   onItemClick: (item: FileTreeItem) => void;
}

export const TreeFilesViewItem: React.FC<TreeItemProps> = ({
   treeItem,
   onItemClick,
}) => {
   const { label, type, children } = treeItem;

   const [isOpen, setIsOpen] = useState(false);
   const hasChildren = children && children.length > 0;
   const rotateIcon = isOpen ? '0deg' : '-90deg';

   const handleItemClick = () => {
      if (type === FileType.File || type === FileType.Unknown) {
         onItemClick(treeItem);
      }

      if (hasChildren) {
         setIsOpen((prev) => !prev);
      }
   };

   return (
      <Flex direction='column'>
         <Flex
            gap={1}
            alignItems='center'
            cursor='pointer'
            transition='background 0.1s'
            transitionTimingFunction='ease-in-out'
            rounded='md'
            p='2px'
            _hover={{
               bg:
                  type === FileType.File || type === FileType.Unknown
                     ? 'var(--vscode-scrollbarSlider-hoverBackground)'
                     : 'transparent',
            }}
            onClick={handleItemClick}
         >
            {hasChildren ? (
               <Icon
                  as={ChevronDownIcon}
                  boxSize={4}
                  transition='transform 0.2s'
                  transform={`rotate(${rotateIcon})`}
               />
            ) : (
               <Box w={4} />
            )}

            <Flex gap='7px' alignItems='center'>
               {type === FileType.Directory ? (
                  <FolderIcon color='var(--vscode-charts-green)' />
               ) : (
                  <FileCode color='var(--vscode-list-highlightForeground)' />
               )}
               <Text fontSize='sm' userSelect='none' transition='color 0.1s'>
                  {label}
               </Text>
            </Flex>
         </Flex>
         {isOpen && (
            <Flex direction='column' gap={2} pl={4} pt={2}>
               {children?.map((child, index) => (
                  <TreeFilesViewItem
                     key={index}
                     treeItem={child}
                     onItemClick={onItemClick}
                     {...child}
                  />
               ))}
            </Flex>
         )}
      </Flex>
   );
};
