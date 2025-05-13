import { Grid, Flex, Text, Box, Tag } from '@chakra-ui/react';

const FeatureItem = ({
   title,
   isComingSoon,
}: {
   title: string;
   isComingSoon?: boolean;
}) => {
   return (
      <Flex
         className='secondary-box'
         borderRadius='md'
         p='4'
         flexDirection='column'
         alignItems='center'
         justifyContent='center'
         h='85px'
         position='relative'
         w='150px'
      >
         {isComingSoon && (
            <Tag
               position='absolute'
               top={0}
               colorScheme='yellow'
               fontSize='xs'
               mt={-3}
            >
               Coming soon!
            </Tag>
         )}
         <Text fontSize='sm' fontWeight='semibold' textAlign='center' w='85%'>
            {title}
         </Text>
      </Flex>
   );
};

const FeaturesPanel = () => {
   return (
      <Box maxW='xs' mx='auto' pt='3'>
         <Text
            fontSize='xl'
            fontWeight='semibold'
            mb='6'
            textAlign='center'
            color='gray.400'
         >
            Try
         </Text>
         <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            gap='5'
         >
            <FeatureItem title='AI Lenses' />
            <FeatureItem title='Intelligent Code Optimization' />
            <FeatureItem title='Code Contextual AI Chat' />
            <FeatureItem title='Fine-tuned Responses' />
            <Flex
               w='full'
               justify='center'
               gridColumn={{
                  sm: 'span 2 / span 2',
               }}
            >
               <FeatureItem title='AI Test Storm' />
            </Flex>
         </Grid>
      </Box>
   );
};

export default FeaturesPanel;
