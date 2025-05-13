import { TestCaseType } from '../enums';

export interface AITestCaseDto {
   id?: string;
   title: string;
   type: TestCaseType;
   when: string;
   given: string;
   then: string;
}

export interface AITestDto extends AITestCaseDto {
   code: string;
   errorMessage?: string;
}
