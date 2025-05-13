import { Flex, FlexProps } from '@chakra-ui/react';

interface Props extends FlexProps {
   children: React.ReactNode;
}

const CenteredContainer = ({ children, ...rest }: Props) => {
   return (
      <Flex w='full' justify='center'>
         <Flex
            w={{
               base: '90%',
               md: '80%',
               lg: '70%',
               xl: '60%',
            }}
            justify='center'
            {...rest}
         >
            {children}
         </Flex>
      </Flex>
   );
};

export default CenteredContainer;
