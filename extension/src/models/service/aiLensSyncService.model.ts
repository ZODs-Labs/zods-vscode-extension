export interface IAILensSyncService {
   manualSync(): Promise<void>;
   triggerSync(): Promise<void>;
}
