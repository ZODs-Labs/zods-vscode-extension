import { Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react';

const UpsertTestCaseForm = () => {
   return (
      <Flex direction='column' gap={3}>
         <Text>New Test Case</Text>

         <Flex w='250px' direction='column' gap={2}>
            <FormLabel>
               <Text as='h3' fontSize='md' opacity={0.8} fontWeight='medium'>
                  Pattern
               </Text>
            </FormLabel>
            <Input />
         </Flex>

         <Flex>
            <Button>Save</Button>
         </Flex>
      </Flex>
   );
};

export default UpsertTestCaseForm;
