import { HTMLProps } from 'react';

import { Flex, Text } from '@chakra-ui/react';

interface BrandLogoProps extends HTMLProps<HTMLImageElement> {
   url: string;
}

export const BrandLogo = ({ url, ...restImgProps }: BrandLogoProps) => {
   return (
      <Flex flexDirection='column' align='center' gap={3}>
         <img
            src={url}
            width='90px'
            height='90px'
            alt='ZODs AI'
            {...restImgProps}
         />
         <Flex direction='column' align='center'>
            <Text fontSize='12px' color='gray.400'>
               Powered by
            </Text>
            <Text fontWeight='bold' fontSize='xl'>
               ZODs AI
            </Text>
         </Flex>
      </Flex>
   );
};
BrandLogo;
