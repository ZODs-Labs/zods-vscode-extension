import React, {
   useEffect,
   useCallback,
   useMemo,
   useRef,
   useState,
} from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
   Box,
   Button,
   VStack,
   List,
   ListItem,
   Text,
   Flex,
   InputGroup,
   ScaleFade,
} from '@chakra-ui/react';

export interface SelectOption {
   value: string | number;
   label: string;
   icon?: React.ReactNode;
}

interface CustomSelectProps {
   options: SelectOption[];
   value: string | number | null;
   isReadOnly?: boolean;
   onChange: (value: string | number) => void;
   onBlur?: () => void;
}

export const Select: React.FC<CustomSelectProps> = ({
   options,
   value,
   isReadOnly,
   onChange,
   onBlur,
   ...otherProps
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedValue, setSelectedValue] = useState<string | number | null>(
      value
   );
   const selectedOption = useMemo(
      () => options.find((option) => option.value === selectedValue),
      [options, selectedValue, value]
   );
   const containerRef = useRef(null);

   const handleSelect = (optionValue: string | number) => {
      setSelectedValue(optionValue);
      onChange(optionValue);
      setIsOpen(false);
   };

   const handleClickOutside = useCallback((event: MouseEvent) => {
      const current = containerRef?.current as any;
      if (current && !current.contains(event.target)) {
         setIsOpen(false);
      }
   }, []);

   useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, [handleClickOutside]);

   useEffect(() => {
      setSelectedValue(value);
   }, [value]);

   const readOnlyStyle = {
      cursor: 'not-allowed',
      opacity: 0.6,
   };

   return (
      <Box
         position='relative'
         width='full'
         ref={containerRef}
         {...otherProps}
         border='1px'
         boxShadow={
            isOpen ? `0 0 0 1px var(--vscode-inputOption-activeBorder)` : ''
         }
         borderRadius='12px'
         transition='all 0.2s'
         borderColor={
            isOpen ? 'var(--vscode-inputOption-activeBorder)' : 'whiteAlpha.300'
         }
         _hover={{
            borderColor: isOpen
               ? 'var(--vscode-inputOption-activeBorder)'
               : 'whiteAlpha.400',
         }}
         _focus={{
            borderColor: 'var(--vscode-inputOption-activeBorder)',
         }}
         tabIndex={0}
         sx={{
            ...(isReadOnly ? readOnlyStyle : {}),
         }}
      >
         <InputGroup>
            <Button
               h='12'
               w='full'
               pl={3}
               pr={10}
               py={2}
               bg='transparent'
               variant='unstyled'
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(!isOpen);
               }}
               pointerEvents={isReadOnly ? 'none' : 'auto'}
               onBlur={onBlur}
            >
               <Text align='start' fontSize='sm' fontWeight='500'>
                  <Flex gap={2}>
                     {selectedOption?.icon}
                     {selectedOption?.label}
                  </Flex>
               </Text>
               <Box
                  position='absolute'
                  right={2}
                  top='50%'
                  transform='translateY(-50%)'
               >
                  {isOpen ? (
                     <ChevronUpIcon boxSize={5} />
                  ) : (
                     <ChevronDownIcon boxSize={5} />
                  )}
               </Box>
            </Button>
         </InputGroup>
         {isOpen && (
            <ScaleFade
               in={true}
               style={{
                  zIndex: 99,
                  position: 'absolute',
                  width: '100%',
               }}
            >
               <VStack
                  zIndex='popover'
                  mt={1}
                  bg='var(--vscode-dropdown-background)'
                  color='var(--vscode-dropdown-foreground)'
                  borderColor='var(--vscode-dropdown-border)'
                  borderWidth='1px'
                  borderStyle='solid'
                  maxH='60'
                  borderRadius='md'
                  overflowY='auto'
                  spacing={0}
                  sx={{
                     '&::-webkit-scrollbar': {
                        width: '11px',
                     },
                     '&::-webkit-scrollbar-track': {
                        width: '6px',
                     },
                     '&::-webkit-scrollbar-thumb': {
                        background: 'gray.500',
                        borderRadius: '24px',
                        transition: 'all 0.2s',
                        '&:hover': {
                           background: 'gray.400',
                        },
                     },
                  }}
               >
                  <Flex justify='start' w='full'>
                     <List w='full'>
                        {options.map((option) => (
                           <ListItem
                              key={option.value}
                              fontSize='sm'
                              bg={
                                 option.value === selectedValue
                                    ? 'gray.500'
                                    : ''
                              }
                              cursor='pointer'
                              _hover={{ bg: 'gray.500' }}
                              px={3}
                              py={2}
                              onClick={() => handleSelect(option.value)}
                           >
                              <Flex gap={2} align='center'>
                                 {option.icon}
                                 <Box>{option.label}</Box>
                              </Flex>
                           </ListItem>
                        ))}
                     </List>
                  </Flex>
               </VStack>
            </ScaleFade>
         )}
      </Box>
   );
};
