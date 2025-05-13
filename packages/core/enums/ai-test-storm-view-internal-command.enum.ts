export enum AITestStormViewInternalCommand {
   GetFileTree = 'getFileTree',
   GenerateTestCases = 'generateTestCases',
   GenerateUnitTest = 'generateUnitTest',
   StopUnitTestsGeneration = 'stopUnitTestsGeneration',
   StopUnitTestCasesGeneration = 'stopUnitTestCasesGeneration',
   AddUnitTestsToExistingFile = 'addUnitTestsToExistingFile',
   CreateNewFileWithUnitTests = 'createNewFileWithUnitTests',
}
