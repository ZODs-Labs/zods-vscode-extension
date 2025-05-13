/**
 * Interface representing a notification service for displaying messages in a VS Code extension.
 */
export interface INotificationService {
   /**
    * Display an informational notification.
    * @param message The message to display.
    */
   showInfo(message: string, ...items: string[]): Thenable<string | undefined>;

   /**
    * Display a warning notification.
    * @param message The message to display.
    */
   showWarning(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined>;

   /**
    * Display an error notification.
    * @param message The message to display.
    */
   showError(message: string, ...items: string[]): Thenable<string | undefined>;
}
