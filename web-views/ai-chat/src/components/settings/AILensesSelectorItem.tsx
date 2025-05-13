import { useState } from 'react';

import { Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';

interface Props {
   id: string;
   label: string;
   enabled: boolean;
   readonly?: boolean;
   onSwitchChange: (id: string, enabled: boolean) => void;
}
const AILensesSelectorItem = ({
   id,
   label,
   enabled,
   readonly,
   onSwitchChange,
}: Props) => {
   const [isEnabled, setIsEnabled] = useState<boolean>(enabled);

   const handleSwitchChange = () => {
      setIsEnabled((prev) => {
         const newEnabled = !prev;
         onSwitchChange(id, newEnabled);
         return newEnabled;
      });
   };

   return (
      <Flex gap={3} align='center' cursor='pointer'>
         <FormControl display='flex' gap={4} alignItems='center'>
            <Switch
               id={id}
               isChecked={isEnabled}
               onChange={handleSwitchChange}
               mb={0}
               className='switch-button'
               disabled={!!readonly}
            />
            <FormLabel htmlFor={id} mb={0}>
               {label}
            </FormLabel>
         </FormControl>
      </Flex>
   );
};

export default AILensesSelectorItem;
