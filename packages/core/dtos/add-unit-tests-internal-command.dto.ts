import { AITestDto } from '../types';

export interface AddUnitTestsInternalCommandDto {
   unitTests: AITestDto[];
   testFilePath: string;
}
