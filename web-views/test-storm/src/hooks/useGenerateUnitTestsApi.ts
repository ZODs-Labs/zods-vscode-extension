import {
   GenerateUnitTestCasesInputDto,
   InternalCommandWebviewMessage,
   WebviewMessageType,
   AITestStormViewInternalCommand,
   AITestDto,
   CollectionUtils,
   GenerateUnitTestInputDto,
   TestStormWebViewMessageCommand,
   AITestCaseDto,
   AIModel,
} from '@zods/core';
import { useTempState } from '@zods/webview-core';

import { StateKeys } from '../shared/state-keys';

export const useGenerateUnitTestsApi = () => {
   const { getTempStateValue, enqueueStateUpdate } = useTempState();

   const aiModel = getTempStateValue(StateKeys.AIModel) || AIModel.GPT4o;
   const hasGeneratedTests = getTempStateValue(StateKeys.UnitTests)?.length > 0;
   const codeContext = getTempStateValue(StateKeys.ContextCode);
   const fileExtension = getTempStateValue(StateKeys.FileExtension);
   const testFramework = getTempStateValue(StateKeys.TestFramework);
   const testPattern = getTempStateValue(StateKeys.TestPattern);
   const testsFileUri = getTempStateValue(StateKeys.TestFilePath);
   const testCases: AITestCaseDto[] =
      getTempStateValue(StateKeys.TestCases) ?? [];

   const generateTestCases = (testCasesOptions: {
      positiveCases: number;
      negativeCases: number;
      edgeCases: number;
   }) => {
      const inputDto: GenerateUnitTestCasesInputDto = {
         code: codeContext,
         aiModel,
         fileExtension,
         testsFileUri,
         totalPositiveTestCases: testCasesOptions.positiveCases,
         totalNegativeTestCases: testCasesOptions.negativeCases,
         totalEdgeCaseTestCases: testCasesOptions.edgeCases,
         numberOfTestCases: 1,
      };

      const message: InternalCommandWebviewMessage = {
         type: WebviewMessageType.InternalCommand,
         internalCommand: AITestStormViewInternalCommand.GenerateTestCases,
         data: inputDto,
      };

      vscode.postMessage(message);
   };

   const generateUnitTests = async (testCaseDtos?: AITestCaseDto[]) => {
      // If user has provided test cases, use those.
      // Otherwise, use the generated test cases.
      const hasProvidedTestCases = !!testCaseDtos?.length;

      if (!hasProvidedTestCases && hasGeneratedTests) {
         // User clicked re-generate unit tests button.
         enqueueStateUpdate(StateKeys.UnitTests, () => []);
      }

      const testCasesToUse = hasProvidedTestCases ? testCaseDtos! : testCases;

      for (const { id, title, when, given, then, type } of testCasesToUse) {
         const inputDto: GenerateUnitTestInputDto = {
            id: id!,
            aiModel,
            code: codeContext,
            fileExtension,
            testFramework,
            testPattern,
            testsFileUri,
            title,
            when,
            given,
            then,
            type,
         };

         const testPlaceholder = {
            ...inputDto,
            code: '',
            errorMessage: '',
         } as AITestDto;

         // It's important to use enqueueStateUpdate here instead of setTempStateValue
         // because we want to update the state in the order that the test cases were generated.
         // Otherwise, race conditions can occur, as the state is updated asynchronously
         // from 2 different places in a short period of time.
         enqueueStateUpdate(StateKeys.UnitTests, (unitTests: AITestDto[]) => {
            const newTestCases = CollectionUtils.merge(unitTests, [
               testPlaceholder,
            ]);

            return newTestCases;
         });

         if (!hasProvidedTestCases) {
            // Scroll to bottom of page only
            // if regular sequential generation of test cases
            setTimeout(() => {
               window.scrollTo(0, document.body.scrollHeight);
            }, 100);
         }

         // Wait for unit test generation
         await generateUnitTest(inputDto);
      }
   };

   const generateUnitTest = async (inputDto: GenerateUnitTestInputDto) => {
      const message: InternalCommandWebviewMessage = {
         type: WebviewMessageType.InternalCommand,
         internalCommand: AITestStormViewInternalCommand.GenerateUnitTest,
         data: inputDto,
      };

      vscode.postMessage(message);

      await waitForResponse(TestStormWebViewMessageCommand.UpsertUnitTests);
   };

   // A function to wait for a response from the VS Code host
   const waitForResponse = (
      expectedCommand: TestStormWebViewMessageCommand
   ) => {
      return new Promise<void>((resolve) => {
         const listener = (event: any) => {
            if (event?.data?.command === expectedCommand) {
               window.removeEventListener('message', listener);
               resolve();
            }
         };

         window.addEventListener('message', listener);
      });
   };

   return {
      generateTestCases,
      generateUnitTests,
   };
};
