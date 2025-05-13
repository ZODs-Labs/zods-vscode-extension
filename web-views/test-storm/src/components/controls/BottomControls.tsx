import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonProps, Flex, Tooltip } from '@chakra-ui/react';

import { PictureInPicture, StopCircle } from 'lucide-react';

import {
   AITestDto,
   AITestStormViewInternalCommand,
   AddUnitTestsInternalCommandDto,
   CreateUnitTestsFileInternalCommandDto,
   WebviewMessageType,
} from '@zods/core';
import { useTempState } from '@zods/webview-core';

import { StateKeys } from '../../shared/state-keys';

interface BottomControlButtonProps extends ButtonProps {
   icon:
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | undefined;
   children: React.ReactNode;
   tooltip?: string;
}

const BottomControlButton = ({
   icon,
   children,
   tooltip,
   ...props
}: BottomControlButtonProps) => {
   return (
      <Box>
         <Tooltip label={tooltip}>
            <Button
               h='full'
               leftIcon={icon}
               {...props}
               fontSize='sm'
               display='flex'
               alignItems='center'
            >
               {children}
            </Button>
         </Tooltip>
      </Box>
   );
};

const BottomControls = () => {
   const { getTempStateValue, setTempStateValue, setTempStateCallback } =
      useTempState();

   const unitTests: AITestDto[] = getTempStateValue(StateKeys.UnitTests);
   const hasAnyUnitTestWithCode = !!unitTests?.some(
      (unitTest: AITestDto) => !!unitTest.code
   );
   const hasLoadingUnitTests = !!unitTests?.some(
      (unitTest: AITestDto) => !unitTest.code && !unitTest.errorMessage
   );
   const isLoadingTestCases = getTempStateValue(StateKeys.IsLoadingTestCases);
   const existingTestsFilePath = getTempStateValue(StateKeys.TestFilePath);

   const handleStopUnitTestsGeneration = () => {
      vscode.postMessage({
         type: WebviewMessageType.InternalCommand,
         internalCommand:
            AITestStormViewInternalCommand.StopUnitTestsGeneration,
      });

      setTempStateValue(StateKeys.IsLoadingUnitTests, false);
      setTempStateCallback(StateKeys.UnitTests, (unitTests: AITestDto[]) => {
         // Remove unit tests that don't have code, i.e. the ones that are generating
         return unitTests.filter((unitTest: AITestDto) => !!unitTest.code);
      });
   };

   const handleStopTestCasesGeneration = () => {
      vscode.postMessage({
         type: WebviewMessageType.InternalCommand,
         internalCommand:
            AITestStormViewInternalCommand.StopUnitTestCasesGeneration,
      });

      setTempStateValue(StateKeys.IsLoadingTestCases, false);
   };

   const handleAddTestsToExistingFile = () => {
      const unitTests = getTempStateValue(StateKeys.UnitTests);
      const testFilePath = getTempStateValue(StateKeys.TestFilePath);
      const dto: AddUnitTestsInternalCommandDto = {
         unitTests,
         testFilePath,
      };

      vscode.postMessage({
         type: WebviewMessageType.InternalCommand,
         internalCommand:
            AITestStormViewInternalCommand.AddUnitTestsToExistingFile,
         data: dto,
      });
   };

   const handleAddTestsToNewFile = () => {
      const unitTests = getTempStateValue(StateKeys.UnitTests);
      const dto: CreateUnitTestsFileInternalCommandDto = {
         unitTests,
      };

      vscode.postMessage({
         type: WebviewMessageType.InternalCommand,
         internalCommand:
            AITestStormViewInternalCommand.CreateNewFileWithUnitTests,
         data: dto,
      });
   };

   return (
      <Flex
         position='fixed'
         bottom={0}
         left={0}
         w='full'
         borderTop='1px solid'
         bg='var(--vscode-activityBar-background)'
         borderColor='var(--vscode-activityBar-border)'
         h='50px'
         justify='center'
         alignItems='center'
         px={2}
      >
         <Flex h='30px' justify='space-between' w='full'>
            <Flex gap={5}>
               {/* <BottomControlButton icon={<ClipboardList size='15px' />}>
                  Add Test Case
               </BottomControlButton> */}
               {existingTestsFilePath && unitTests?.length ? (
                  <>
                     <BottomControlButton
                        icon={<PictureInPicture size='15px' />}
                        onClick={handleAddTestsToExistingFile}
                     >
                        Add Tests to Existing File
                     </BottomControlButton>
                  </>
               ) : (
                  <></>
               )}

               <BottomControlButton
                  icon={<AddIcon boxSize='10px' />}
                  tooltip={unitTests?.length ? '' : 'No generated tests'}
                  isDisabled={!hasAnyUnitTestWithCode}
                  isLoading={hasLoadingUnitTests}
                  onClick={handleAddTestsToNewFile}
               >
                  Add Tests to New File
               </BottomControlButton>
            </Flex>

            <Flex gap={5}>
               {hasLoadingUnitTests && (
                  <BottomControlButton
                     variant='outline'
                     colorScheme='red'
                     icon={<StopCircle size='17px' />}
                     onClick={handleStopUnitTestsGeneration}
                  >
                     Stop Tests Generation
                  </BottomControlButton>
               )}

               {isLoadingTestCases && (
                  <BottomControlButton
                     variant='outline'
                     colorScheme='red'
                     icon={<StopCircle size='17px' />}
                     onClick={handleStopTestCasesGeneration}
                  >
                     Stop Test Cases Generation
                  </BottomControlButton>
               )}
            </Flex>
         </Flex>
      </Flex>
   );
};

export default BottomControls;
