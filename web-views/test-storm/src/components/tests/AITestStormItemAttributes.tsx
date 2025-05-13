import { Flex, FlexProps, Text } from '@chakra-ui/react';

export interface IAITestStormItemAttributesProps extends FlexProps {
   given: string;
   when: string;
   then: string;
}

const AITestStormItemAttributesSingle = ({
   label,
   value,
   color,
   borderColor,
}: {
   label: string;
   value: string;
   color: string;
   borderColor: string;
}) => {
   return (
      <Flex
         alignItems='center'
         gap={3}
         border={1}
         borderStyle='solid'
         borderColor={borderColor}
         rounded='md'
         p='3px'
         pr={5}
      >
         <Text
            fontSize='xs'
            fontWeight='semibold'
            w='40px'
            textAlign='right'
            color={color}
         >
            {label}
         </Text>
         <Text fontSize='xs' opacity={0.8}>
            {value}
         </Text>
      </Flex>
   );
};

const AITestStormItemAttributes = ({
   given,
   when,
   then,
   ...otherProps
}: IAITestStormItemAttributesProps) => {
   return (
      <Flex
         direction='column'
         gap={2}
         p={4}
         my={2}
         rounded='md'
         {...otherProps}
      >
         <AITestStormItemAttributesSingle
            label='Given'
            value={given}
            color='inherit'
            borderColor='var(--vscode-editorWidget-border)'
         />
         <AITestStormItemAttributesSingle
            label='When'
            value={when}
            color={'var(--vscode-editorLink-activeForeground)'}
            borderColor='var(--vscode-minimap-selectionHighlight)'
         />
         <AITestStormItemAttributesSingle
            label='Then'
            value={then}
            color={'var(--vscode-debugIcon-startForeground)'}
            borderColor='var(--vscode-merge-currentHeaderBackground)'
         />
      </Flex>
   );
};

export default AITestStormItemAttributes;
