import { Flex, FlexProps } from '@chakra-ui/react';

interface Props extends FlexProps {
   children: React.ReactNode;
}

export const FlexCentered = ({ children, ...rest }: Props) => {
   return (
      <Flex justify='center' alignItems='center' {...rest}>
         {children}
      </Flex>
   );
};
