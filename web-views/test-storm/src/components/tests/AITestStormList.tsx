import { Flex } from '@chakra-ui/react';

import { AITestDto } from '@zods/core';
import { StateKeys, useTempState } from '@zods/webview-core';

import AITestItem from './AITestStormItem';

const AITestStormList = () => {
   const { getTempStateValue } = useTempState();

   const tests = getTempStateValue(StateKeys.UnitTests) || [];

   return (
      <Flex direction='column' gap={10} pb={10}>
         {tests?.map((test: AITestDto, i: number) => (
            <Flex key={i} flex={1} w='full'>
               <AITestItem test={test} />
            </Flex>
         ))}
      </Flex>
   );
};

export default AITestStormList;
