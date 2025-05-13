import { Uri } from 'vscode';

import {
   IAbstractWebViewManager,
   IWebViewPanelMetadata,
} from './abstractWebViewManager.model';

export interface TestStormWebViewPanelMetadata extends IWebViewPanelMetadata {
   testMethodFileUri: Uri;
}
export interface ITestStormWebViewManager extends IAbstractWebViewManager {}
