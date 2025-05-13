import { TestCaseType } from '../enums';

export interface GenerateUnitTestCasesInputDto {
   code: string;
   fileExtension: string;
   testsCode?: string;
   testsFileUri?: string;
   numberOfTestCases: number;
   totalPositiveTestCases: number;
   totalNegativeTestCases: number;
   totalEdgeCaseTestCases: number;
   [key: string]: any;
}

export interface GenerateUnitTestInputDto {
   id: string;
   code: string;
   title: string;
   fileExtension: string;
   testPattern: string;
   testFramework: string;
   testsCode?: string;
   testsFileUri?: string;
   when: string;
   given: string;
   then: string;
   type: TestCaseType;
   [key: string]: any;
}
