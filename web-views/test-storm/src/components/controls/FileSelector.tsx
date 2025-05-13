import { useEffect, useState } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import {
   Box,
   Flex,
   FormLabel,
   IconButton,
   Tooltip,
   Text,
   Link,
} from '@chakra-ui/react';

import {
   AITestStormViewInternalCommand,
   FileTreeItem,
   InternalCommandWebviewMessage,
   WebviewMessageType,
} from '@zods/core';
import { StateKeys, useTempState } from '@zods/webview-core';

import { FileSelectorModal } from '../FileSelectorModal';

interface FileSelectorProps {
   onFileSelect: (item: FileTreeItem) => void;
   onSelectedFileClear: () => void;
}

const FileSelector = ({
   onFileSelect,
   onSelectedFileClear,
}: FileSelectorProps) => {
   const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(null);
   const { getTempStateValue } = useTempState();

   useEffect(() => {
      if (vscode !== undefined) {
         const getFileTreeInternalCommand: InternalCommandWebviewMessage = {
            type: WebviewMessageType.InternalCommand,
            internalCommand: AITestStormViewInternalCommand.GetFileTree,
         };
         vscode.postMessage(getFileTreeInternalCommand);
      }
   }, []);

   const fileTree: FileTreeItem[] = getTempStateValue(StateKeys.FileTree);
   // const fileTree: FileTreeItem[] = [
   //    {
   //       label: 'src',
   //       type: FileType.Directory,
   //       path: '/src',
   //       relativePath: 'src',
   //       children: [
   //          {
   //             label: 'index.ts',
   //             type: FileType.File,
   //             path: '/src/index.ts',
   //             relativePath: 'src/index.ts',
   //          },
   //          {
   //             label: 'test.ts',
   //             type: FileType.File,
   //             path: '/src/test.ts',
   //             relativePath: 'src/test.ts',
   //          },
   //       ],
   //    },
   //    {
   //       label: 'package.json',
   //       type: FileType.File,
   //       path: '/package.json',
   //       relativePath: 'package.json',
   //    },
   // ];

   const handleFileSelect = (item: FileTreeItem) => {
      setSelectedFile(item);
      onFileSelect(item);
   };

   const clearTestFile = () => {
      setSelectedFile(null);
      onSelectedFileClear();
   };

   return (
      <Flex direction='column' gap={2}>
         <FormLabel>
            <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
               Test File
            </Text>
         </FormLabel>
         <Flex
            gap={2}
            alignItems='center'
            _hover={{
               '& .clear-btn': {
                  opacity: 1,
               },
            }}
         >
            <FileSelectorModal
               title='Select Test File'
               filesTree={fileTree}
               onItemSelect={handleFileSelect}
            >
               <Text>
                  {selectedFile ? selectedFile.label : 'Choose Test File'}
               </Text>
            </FileSelectorModal>

            {selectedFile && (
               <Box>
                  <Tooltip label='Unlink test file' placement='right'>
                     <IconButton
                        className='clear-btn'
                        opacity={0}
                        variant='outline'
                        size='sm'
                        icon={<CloseIcon />}
                        aria-label='Clear'
                        onClick={clearTestFile}
                     />
                  </Tooltip>
               </Box>
            )}
         </Flex>
         {selectedFile && (
            <Link
               href={`command:vscode.open?${encodeURIComponent(
                  JSON.stringify(selectedFile.path)
               )}`}
               fontSize='xs'
               pl='3px'
               color='var(--vscode-descriptionForeground)'
            >
               {selectedFile.relativePath}
            </Link>
         )}

         <Text fontSize='xs' color='var(--vscode-disabledForeground)'>
            If you have existing tests, select the file containing the existing tests and
            it'll be used as pattern for the new tests.
         </Text>
      </Flex>
   );
};

export default FileSelector;
