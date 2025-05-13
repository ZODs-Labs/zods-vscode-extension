import { useEffect, useState } from 'react';

import { Button, Flex, Text } from '@chakra-ui/react';

import { AITestCaseDto } from '@zods/core';
import {
   FlexCentered,
   MarkdownRenderer,
   TypingIndicator,
   useTempState,
} from '@zods/webview-core';

import { useGenerateUnitTestsApi } from '../../../hooks/useGenerateUnitTestsApi';
import { StateKeys } from '../../../shared/state-keys';
import AITestStormTestCaseControls, {
   AITestStormTestCasesOptions,
} from './AITestStormTestCaseControls';
import AITestStormTestCaseItem from './AITestStormTestCaseItem';

const AITestStormTestCases = () => {
   const [testStormCasesOptions, setTestStormCasesOptions] = useState({
      positiveCases: 2,
      negativeCases: 2,
      edgeCases: 2,
   });

   const { getTempStateValue, setTempStateValue } = useTempState();
   const testCases: AITestCaseDto[] =
      getTempStateValue(StateKeys.TestCases) ?? [];

   const hasGeneratedTests = getTempStateValue(StateKeys.UnitTests)?.length > 0;
   const isGenerateTestCasesLoading = getTempStateValue(
      StateKeys.IsLoadingTestCases
   );
   const testCasesErrorMessage = getTempStateValue(
      StateKeys.TestCasesErrorMessage
   );

   const { generateTestCases, generateUnitTests } = useGenerateUnitTestsApi();

   useEffect(() => {
      setTempStateValue(StateKeys.IsLoadingTestCases, false);
   }, [testCases.length]);

   const handleGenerateTestCases = () => {
      setTempStateValue(StateKeys.IsLoadingTestCases, true);
      generateTestCases(testStormCasesOptions);
   };

   const handleGenerateTestsButtonClick = () => {
      generateUnitTests();
   };

   const handleOptionsChange = (opt: AITestStormTestCasesOptions) => {
      setTestStormCasesOptions(opt);
   };

   const handleRemoveTestCase = (index: number) => {
      const newTestCases = testCases.filter((_, i) => i !== index);
      setTempStateValue(StateKeys.TestCases, newTestCases);
   };

   return (
      <Flex direction='column' gap='40px'>
         <AITestStormTestCaseControls onOptionsChange={handleOptionsChange} />

         <Flex gap={1} wrap='wrap' w='full'>
            <Button
               flex='45%'
               onClick={handleGenerateTestCases}
               isLoading={isGenerateTestCasesLoading}
            >
               Generate Test Cases
            </Button>
            <Button
               variant='vscode-primary'
               flex='45%'
               isDisabled={testCases.length === 0 || isGenerateTestCasesLoading}
               onClick={handleGenerateTestsButtonClick}
            >
               {hasGeneratedTests ? 'Re-generate Tests' : 'Generate Tests'}{' '}
               {`(${testCases.length})`}
            </Button>
         </Flex>

         {testCasesErrorMessage ? (
            <Flex px={2}>
               <MarkdownRenderer isError content={testCasesErrorMessage} />
            </Flex>
         ) : (
            <Flex direction='column' gap={3} pt={5}>
               {isGenerateTestCasesLoading ? (
                  <FlexCentered direction='column' gap={1} w='full' h='100px'>
                     <TypingIndicator />
                     <Text
                        fontSize='sm'
                        color='var(--vscode-disabledForeground)'
                     >
                        Generating test cases...
                     </Text>
                  </FlexCentered>
               ) : (
                  testCases?.map((testCase: AITestCaseDto, index: number) => (
                     <Flex key={index}>
                        <AITestStormTestCaseItem
                           index={index}
                           testCase={testCase}
                           onRemove={handleRemoveTestCase}
                        />
                     </Flex>
                  ))
               )}
            </Flex>
         )}
      </Flex>
   );
};

export default AITestStormTestCases;
