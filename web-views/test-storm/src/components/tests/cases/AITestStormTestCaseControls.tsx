import { useState } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import AITestStormTestCaseNumberSlider from './AITestStormTestCaseNumberSlider';

export interface AITestStormTestCasesOptions {
   positiveCases: number;
   negativeCases: number;
   edgeCases: number;
}

interface AITestStormTestCaseControlsProps {
   onOptionsChange: (options: AITestStormTestCasesOptions) => void;
}

const AITestStormTestCaseControls = ({
   onOptionsChange,
}: AITestStormTestCaseControlsProps) => {
   const [positiveCasesSliderValue, setPositiveCasesSliderValue] = useState(2);
   const [negativeCasesSliderValue, setNegativeCasesSliderValue] = useState(2);
   const [edgeCaseCasesSliderValue, setEdgeCasesSliderValue] = useState(2);

   const handlePositiveCasesSliderChange = (val: number) => {
      setPositiveCasesSliderValue(val);

      onOptionsChange({
         positiveCases: val,
         negativeCases: negativeCasesSliderValue,
         edgeCases: edgeCaseCasesSliderValue,
      });
   };

   const handleNegativeCasesSliderChange = (val: number) => {
      setNegativeCasesSliderValue(val);

      onOptionsChange({
         positiveCases: positiveCasesSliderValue,
         negativeCases: val,
         edgeCases: edgeCaseCasesSliderValue,
      });
   };

   const handleEdgeCasesSliderChange = (val: number) => {
      setEdgeCasesSliderValue(val);

      onOptionsChange({
         positiveCases: positiveCasesSliderValue,
         negativeCases: negativeCasesSliderValue,
         edgeCases: val,
      });
   };

   return (
      <Flex wrap='wrap' gap='50px' py={6}>
         <Flex direction='column' w='270px' gap={3} pl={2}>
            <Text fontSize='md' opacity={0.8} fontWeight='medium'>
               Positive Cases
            </Text>
            <AITestStormTestCaseNumberSlider
               trackBgColor='green.100'
               trackFillColor='green.500'
               onChange={handlePositiveCasesSliderChange}
            />
         </Flex>
         <Flex direction='column' w='270px' gap={3}>
            <Text fontSize='md' opacity={0.8} fontWeight='medium'>
               Negative Cases
            </Text>
            <AITestStormTestCaseNumberSlider
               trackBgColor='red.100'
               trackFillColor='red.500'
               onChange={handleNegativeCasesSliderChange}
            />
         </Flex>
         <Flex direction='column' w='270px' gap={3}>
            <Text fontSize='md' opacity={0.8} fontWeight='medium'>
               Edge Cases
            </Text>
            <AITestStormTestCaseNumberSlider
               trackBgColor='orange.100'
               trackFillColor='orange.500'
               onChange={handleEdgeCasesSliderChange}
            />
         </Flex>
      </Flex>
   );
};

export default AITestStormTestCaseControls;
