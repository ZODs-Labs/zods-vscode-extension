import { ScaleFade, ScaleFadeProps } from '@chakra-ui/react';

export const ShScaleFade = (props: ScaleFadeProps) => {
   return (
      <ScaleFade
         initialScale={0.8}
         transition={{
            enter: {
               delay: 0.05,
               duration: 0.1,
            },
            exit: {
               delay: 0,
            },
         }}
         in
         {...props}
      ></ScaleFade>
   );
};
