import { useCallback, useEffect } from 'react';

import { MessageCommand } from '@zods/core';

import { StateKeys } from '../constants';
import { useTempState } from '../providers/state.provider';

export const useVSCodePostMessageListener = () => {
   const { setTempStateValue } = useTempState();

   const setAuthToken = useCallback(
      (payload: any) => {
         setTempStateValue(StateKeys.AuthToken, payload.data);
      },
      [setTempStateValue]
   );

   const handleMessage = (event: MessageEvent) => {
      // TODO: Add security checks to validate the message origin/source

      const payload = event.data;
      switch (payload.command) {
         case MessageCommand.SetAuthToken:
            setAuthToken(payload);
            break;
         case MessageCommand.UpdateConfig:
            const { key, value } = payload.data;
            if (key) {
               setTempStateValue(key, value);
            }
            break;
         case MessageCommand.SetCodeAsAIChatContext:
            setTempStateValue(StateKeys.AIChatCodeContext, payload.data);
            break;
         case MessageCommand.SetFileExtension:
            setTempStateValue(StateKeys.FileExtension, payload.data);
            break;
         default:
      }
   };

   useEffect(() => {
      window.addEventListener('message', handleMessage);
      return () => {
         window.removeEventListener('message', handleMessage);
      };
   }, []);
};
