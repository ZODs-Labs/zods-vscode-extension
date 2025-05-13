import { useCallback, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import {
   AITestDto,
   CollectionUtils,
   TestStormWebViewMessageCommand,
} from '@zods/core';
import { State, useTempState } from '@zods/webview-core';

import { StateKeys } from '../shared/state-keys';

export const useVSCodePostMessageListener = () => {
   const { setTempStateValue, setTempState, enqueueStateUpdate } =
      useTempState();
   const toast = useToast();

   const handleMessage = useCallback(
      (event: MessageEvent) => {
         // TODO: Implement origin/source validation for security
         const payload = event.data;
         switch (payload.command) {
            case TestStormWebViewMessageCommand.SetContextCode:
               setTempStateValue(StateKeys.ContextCode, payload.data);
               break;
            case TestStormWebViewMessageCommand.SetFileExtension:
               setTempStateValue(StateKeys.FileExtension, payload.data);
               break;
            case TestStormWebViewMessageCommand.SetFileTree:
               setTempStateValue(StateKeys.FileTree, payload.data);
               break;
            case TestStormWebViewMessageCommand.SetTestCases:
               setTempState((state: State) => ({
                  ...state,
                  [StateKeys.TestCases]: payload.data,
                  [StateKeys.TestCasesErrorMessage]: null,
               }));
               break;
            case TestStormWebViewMessageCommand.UpsertUnitTests:
               upsertUnitTests(payload);
               break;
            case TestStormWebViewMessageCommand.ShowErrorMessage:
               payload?.data && showErrorMessage(payload);
               resetLoadingState();
               break;
            case TestStormWebViewMessageCommand.SetTestCasesErrorMessage:
               setTempState((state: State) => ({
                  ...state,
                  [StateKeys.TestCasesErrorMessage]: payload.data,
                  [StateKeys.IsLoadingTestCases]: false,
               }));
               break;
            case TestStormWebViewMessageCommand.SetUnitTestsErrorMessage:
               setUnitTestsErrorMessage(payload);
               break;
            default:
         }
      },
      [setTempStateValue]
   );

   const upsertUnitTests = useCallback((payload: any) => {
      let unitTests: AITestDto[] = payload.data;
      if (!Array.isArray(unitTests)) {
         unitTests = [unitTests];
      }

      enqueueStateUpdate(StateKeys.UnitTests, (tests: AITestDto[]) => {
         return CollectionUtils.merge(tests, unitTests);
      });
   }, []);

   const showErrorMessage = useCallback(
      (payload: any) => {
         toast({
            description: payload.data,
            status: 'warning',
            duration: 4000,
            isClosable: true,
         });
      },
      [toast]
   );

   const resetLoadingState = useCallback(() => {
      setTempState((state: State) => ({
         ...state,
         [StateKeys.UnitTests]:
            state[StateKeys.UnitTests]?.filter(
               (unitTest: AITestDto) => !!unitTest.code
            ) || [],
         [StateKeys.IsLoadingTestCases]: false,
      }));
   }, [setTempState]);

   const setUnitTestsErrorMessage = useCallback(
      (payload: any) => {
         const unitTestsErrorDetails = payload.data;
         const { id, message } = unitTestsErrorDetails;
         if (!message) {
            return;
         }

         setTempState((state: State) => {
            if (id) {
               // If id is provided, remove the unit test from the list
               // it means that the error message is related to a single unit test
               const unitTests = state[StateKeys.UnitTests] as AITestDto[];

               const indexOfUnitTest = unitTests.findIndex(
                  (unitTest: AITestDto) => unitTest.id === id
               );

               if (indexOfUnitTest > -1) {
                  unitTests[indexOfUnitTest].errorMessage = message;
               }

               return {
                  ...state,
                  [StateKeys.UnitTests]: unitTests,
               };
            }

            return {
               ...state,
               [StateKeys.UnitTestsErrorMessage]: message,
            };
         });
      },
      [setTempState]
   );

   useEffect(() => {
      window.addEventListener('message', handleMessage);

      return () => {
         // Cleanup event listener
         window.removeEventListener('message', handleMessage);
      };
   }, [handleMessage]);
};
