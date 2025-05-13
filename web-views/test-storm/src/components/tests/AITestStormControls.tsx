import { useEffect, useState } from 'react';

import { Flex, Text, FormLabel } from '@chakra-ui/react';

import { AIModel, FileTreeItem } from '@zods/core';
import { Select, useTempState } from '@zods/webview-core';

import { StateKeys } from '../../shared/state-keys';
import { testFrameworks as allTestFrameworks } from '../../shared/test-frameworks';
import FileSelector from '../controls/FileSelector';

enum TestPattern {
   AAA = 'arrange_act_assert',
   BDD = 'behavior_driven_development',
   TDD = 'test_driven_development',
}

const testPatternOptions = [
   {
      label: 'Arrange-Act-Assert (AAA)',
      value: TestPattern.AAA,
   },
];

const AITestStormControls = () => {
   // const [customInstructions, setCustomInstructions] = useState('');
   const [testPattern, setTestPattern] = useState(TestPattern.AAA);
   const [testFramework, setTestFramework] = useState('');
   const [languageTestFrameworks, setLanguageTestFrameworks] = useState<{
      languages: string[];
      frameworks: { label: string; value: string }[];
      default: string;
   } | null>(null);

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { getTempStateValue, setTempStateValue } = useTempState();

   const fileExtension = getTempStateValue(StateKeys.FileExtension) || 'js';

   useEffect(() => {
      const languageTestFrameworks = allTestFrameworks.find((tf) =>
         tf.languages.includes(fileExtension)
      );

      if (languageTestFrameworks) {
         setTestFramework(languageTestFrameworks.default);
         setLanguageTestFrameworks(languageTestFrameworks);
      } else {
         // Handle the case where no matching framework is found
         // For example, set it to a default value or keep it empty
         setTestFramework('');
      }
   }, [fileExtension]);

   // const handleCustomInstructionsChange = (e: any) => {
   //    setCustomInstructions(e.target.value);
   // };

   const handleTestPatternChange = (val: string | number) => {
      setTestPattern(val as TestPattern);
      setTempStateValue(StateKeys.TestPattern, val);
   };

   const handleTestFrameworkChange = (val: string | number) => {
      setTestFramework(val as string);

      const testFramework = languageTestFrameworks?.frameworks.find(
         (f) => f.value === val
      )?.label;

      setTempStateValue(StateKeys.TestFramework, testFramework);
   };

   const handleAIModelChange = (val: string | number) => {
      setTempStateValue(StateKeys.AIModel, val);
   };

   const setTestFile = (file: FileTreeItem | null) => {
      setTempStateValue(StateKeys.TestFilePath, file?.path ?? null);
   };

   const clearTestFile = () => {
      setTestFile(null);
   };

   return (
      <Flex direction='column' gap={10}>
         <Flex wrap='wrap' gap={10}>
            <Flex w='250px' direction='column' gap={2}>
               <FormLabel>
                  <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
                     Framework
                  </Text>
               </FormLabel>
               <Select
                  options={languageTestFrameworks?.frameworks ?? []}
                  value={testFramework}
                  onChange={handleTestFrameworkChange}
               />
            </Flex>
            <Flex w='250px' direction='column' gap={2}>
               <FormLabel>
                  <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
                     Pattern
                  </Text>
               </FormLabel>
               <Select
                  options={testPatternOptions}
                  value={testPattern}
                  onChange={handleTestPatternChange}
               />
            </Flex>
            <Flex w='250px' direction='column' gap={2}>
               <FormLabel>
                  <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
                     AI Model
                  </Text>
               </FormLabel>
               <Select
                  value={AIModel.GPT41}
                  onChange={handleAIModelChange}
                  options={[
                     {
                        label: 'GPT-4',
                        value: AIModel.GPT41,
                     },
                     {
                        label: 'O3',
                        value: AIModel.O3,
                     },
                     {
                        label: 'O4-Mini',
                        value: AIModel.O4Mini,
                     },
                  ]}
               />
            </Flex>
         </Flex>
         {/* <Flex direction='column' gap={2}>
            <FormLabel>
               <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
                  Custom Instructions
               </Text>
            </FormLabel>
            <Textarea
               borderRadius='12px'
               fontSize='sm'
               size='lg'
               onChange={handleCustomInstructionsChange}
            />

            <Text
               fontSize='14px'
               color='gray.400'
               textAlign='right'
               mt={2}
               pr={1}
            >
               {customInstructions?.length || 0}/500
            </Text>
         </Flex> */}
         <FileSelector
            onFileSelect={setTestFile}
            onSelectedFileClear={clearTestFile}
         />
      </Flex>
   );
};

export default AITestStormControls;
