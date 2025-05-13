export interface IOutputChannelService {
   appendLine(value: string): void;
   show(): void;
   dispose(): void;
}
