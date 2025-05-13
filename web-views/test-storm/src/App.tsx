import { Box } from '@chakra-ui/react';

import { FlexCentered, StateProvider } from '@zods/webview-core';

import './App.scss';
import BottomControls from './components/controls/BottomControls';
import AITestStormContainer from './components/tests/AITestStormContainer';
import { ENV } from './env';
import { useVSCodePostMessageListener } from './hooks/useVSCodePostMessageListener';

// const tests: AITestDto[] = [
//    {
//       type: TestCaseType.EdgeCase,
//       title: 'Subtracting a very small number from a large number',
//       when: 'subtract is called with a very small and a large number',
//       given: 'a = 1000000 and b = 0.000001',
//       then: 'should handle floating point precision correctly',
//       code: "```javascript\nit('should handle floating point precision correctly with small and large numbers', () => {\n    // Arrange\n    const a = 1000000, b = 0.000001;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBeCloseTo(1000000000000);\n});\n```",
//    },
//    {
//       type: TestCaseType.EdgeCase,
//       title: 'Subtracting with Infinity',
//       when: 'subtract is called with Infinity as an input',
//       given: 'a = Infinity and b = 1',
//       then: 'should return Infinity',
//       code: "```javascript\nit('should return Infinity when one input is Infinity', () => {\n    // Arrange\n    const a = Infinity, b = 1;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBe(Infinity);\n});\n```",
//    },
//    {
//       type: TestCaseType.Positive,
//       title: 'Subtracting two positive numbers',
//       when: 'subtract is called with two positive numbers',
//       given: 'a = 10 and b = 2',
//       then: 'should return 5',
//       code: "```javascript\nit('should return 5 when subtracting 2 from 10', () => {\n    // Arrange\n    const a = 10, b = 2;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBe(5);\n});\n```",
//    },
//    {
//       type: TestCaseType.Positive,
//       title: 'Subtracting two negative numbers',
//       when: 'subtract is called with two negative numbers',
//       given: 'a = -10 and b = -2',
//       then: 'should return 5',
//       code: "```javascript\nit('should return 5 when subtracting -2 from -10', () => {\n    // Arrange\n    const a = -10, b = -2;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBe(5);\n});\n```",
//    },
//    {
//       type: TestCaseType.Negative,
//       title: 'Subtracting when b is 0',
//       when: 'subtract is called and b is 0',
//       given: 'a = 10 and b = 0',
//       then: 'should return 0',
//       code: "```javascript\nit('should return 0 when b is 0', () => {\n    // Arrange\n    const a = 10, b = 0;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBe(0);\n});\n```",
//    },
//    {
//       type: TestCaseType.Negative,
//       title: 'Subtracting with NaN inputs',
//       when: 'subtract is called with NaN inputs',
//       given: 'a = NaN and b = NaN',
//       then: 'should return NaN',
//       code: "```javascript\nit('should return NaN when inputs are NaN', () => {\n    // Arrange\n    const a = NaN, b = NaN;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBeNaN();\n});\n```",
//    },
//    {
//       type: TestCaseType.EdgeCase,
//       title: 'Subtracting a very small number from a large number',
//       when: 'subtract is called with a very small and a large number',
//       given: 'a = 1000000 and b = 0.000001',
//       then: 'should handle floating point precision correctly',
//       code: "```javascript\nit('should handle floating point precision correctly with small and large numbers', () => {\n    // Arrange\n    const a = 1000000, b = 0.000001;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBeCloseTo(1000000000000);\n});\n```",
//    },
//    {
//       type: TestCaseType.EdgeCase,
//       title: 'Subtracting with Infinity',
//       when: 'subtract is called with Infinity as an input',
//       given: 'a = Infinity and b = 1',
//       then: 'should return Infinity',
//       code: "```javascript\nit('should return Infinity when one input is Infinity', () => {\n    // Arrange\n    const a = Infinity, b = 1;\n    // Act\n    const result = subtract(a, b);\n    // Assert\n    expect(result).toBe(Infinity);\n});\n```",
//    },
// ];

// const ts: AITestCaseDto[] = [
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
//    {
//       title: 'Should return 2 when given 4 and 2',
//       type: TestCaseType.Positive,
//       when: 'When',
//       given: 'Given',
//       then: 'Then',
//    },
// ];

const AppContent = () => {
   useVSCodePostMessageListener();

   return (
      <FlexCentered w='full'>
         <Box
            w={ENV.IS_DEV ? '1000px' : 'full'}
            minH='full'
            bg='var(--vscode-dropdown-listBackground)'
            px={5}
            py={3}
            pb='100px'
         >
            <AITestStormContainer />
         </Box>

         <BottomControls />
      </FlexCentered>
   );
};

const App = () => {
   return (
      <StateProvider>
         <AppContent />
      </StateProvider>
   );
};

export default App;
