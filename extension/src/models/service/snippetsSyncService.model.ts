import { SnippetsSyncResult } from '@common/enums';

export interface ISnippetSyncService {
   manualSync(): Promise<SnippetsSyncResult>;
}
