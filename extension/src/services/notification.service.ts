/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { INotificationService, IVSCodeService } from '@models/service';

export class NotificationService implements INotificationService {
   constructor(private vscodeService: IVSCodeService) {}

   showInfo(message: string, ...items: string[]): Thenable<string | undefined> {
      return this.vscodeService.window.showInformationMessage(
         message,
         ...items
      );
   }
   showWarning(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined> {
      return this.vscodeService.window.showWarningMessage(message, ...items);
   }
   showError(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined> {
      return this.vscodeService.window.showErrorMessage(message, ...items);
   }
}

export default NotificationService;
