import { Badge } from '@chakra-ui/react';

import { EnumUtils, TestCaseType } from '@zods/core';

const TestCaseTypeBadge = ({ type }: { type: TestCaseType }) => {
   return (
      <Badge px='10px' py='4px' fontSize='10px' rounded='4px'>
         {EnumUtils.formatNumericEnumValueToLabel(TestCaseType, type)}
      </Badge>
   );
};

export default TestCaseTypeBadge;
