import React from 'react';

import { Flex } from '@chakra-ui/react';

import { FileTreeItem } from '@zods/core';

import { TreeFilesViewItem } from './TreeFilesViewItem';

interface TreeViewProps {
   data: FileTreeItem[];
   onItemClick?: (item: FileTreeItem) => void;
}

export const TreeFilesView: React.FC<TreeViewProps> = ({
   data,
   onItemClick,
}) => {
   const handleItemClick = (item: FileTreeItem) => {
      onItemClick?.(item);
   };

   return (
      <Flex direction='column' gap={2}>
         {data?.map((item, index) => (
            <TreeFilesViewItem
               key={index}
               treeItem={item}
               onItemClick={handleItemClick}
            />
         ))}
      </Flex>
   );
};
