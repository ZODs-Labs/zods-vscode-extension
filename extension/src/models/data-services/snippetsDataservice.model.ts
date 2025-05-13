import { UserSnippetsDto } from '@models/api';

export interface ISnippetsDataService {
   getUserSnippets(): Promise<UserSnippetsDto>;
   getUserSnippetsVersion(): Promise<number>;
}
