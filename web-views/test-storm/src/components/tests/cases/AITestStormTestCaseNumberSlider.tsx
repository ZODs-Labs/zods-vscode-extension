import { useState } from 'react';

import {
   Slider,
   SliderMark,
   SliderTrack,
   SliderFilledTrack,
   SliderThumb,
} from '@chakra-ui/react';

interface AITestStormTestCaseNumberSliderProps {
   trackFillColor: string;
   trackBgColor: string;
   onChange: (val: number) => void;
}

const AITestStormTestCaseNumberSlider = ({
   trackBgColor,
   trackFillColor,
   onChange,
}: AITestStormTestCaseNumberSliderProps) => {
   const [sliderValue, setSliderValue] = useState(2);

   const handleSliderChange = (v: number) => {
      setSliderValue(v);
      onChange(v);
   };

   return (
      <Slider value={sliderValue} min={1} max={5} onChange={handleSliderChange}>
         <SliderMark value={1} mt='2' ml='-2px' fontSize='sm'>
            1
         </SliderMark>
         <SliderMark value={2} mt='2' ml='-4px' fontSize='sm'>
            2
         </SliderMark>
         <SliderMark value={3} mt='2' ml='-4px' fontSize='sm'>
            3
         </SliderMark>
         <SliderMark value={4} mt='2' ml='-4px' fontSize='sm'>
            4
         </SliderMark>
         <SliderMark value={5} mt='2' ml='-7px' fontSize='sm'>
            5
         </SliderMark>
         <SliderTrack bg={trackBgColor}>
            <SliderFilledTrack bg={trackFillColor} />
         </SliderTrack>
         <SliderThumb />
      </Slider>
   );
};

export default AITestStormTestCaseNumberSlider;
