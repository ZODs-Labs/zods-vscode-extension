import { CancelToken } from 'axios';

import {
   GenerateUnitTestCasesInputDto,
   AITestCaseDto,
   GenerateUnitTestInputDto,
   AITestDto,
} from '@zods/core';

export interface IAITestStormService {
   generateTestCasesWithAI(
      inputDto: GenerateUnitTestCasesInputDto,
      cancelToken?: CancelToken
   ): Promise<AITestCaseDto[]>;

   generateUnitTestWithAI(
      inputDto: GenerateUnitTestInputDto,
      cancelToken?: CancelToken
   ): Promise<AITestDto>;
}
