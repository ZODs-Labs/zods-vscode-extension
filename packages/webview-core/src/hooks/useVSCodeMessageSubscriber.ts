import { useCallback, useEffect } from 'react';

interface Props {
   messageCommand: string;
   callback: (data: any) => void;
}
export const useVSCodeMessageSubscriber = ({
   messageCommand,
   callback,
}: Props) => {
   // Message handler that checks for the specific command and executes the callback
   const handleMessage = useCallback(
      (event: MessageEvent) => {
         // TODO: Add security checks to validate the message origin/source

         const payload = event.data;
         if (payload.command === messageCommand) {
            callback(payload);
         }
      },
      [messageCommand, callback]
   );

   useEffect(() => {
      // Register event listener for 'message' events
      window.addEventListener('message', handleMessage);

      // Cleanup event listener when the component is unmounted
      return () => {
         window.removeEventListener('message', handleMessage);
      };
   }, [handleMessage]);
};
