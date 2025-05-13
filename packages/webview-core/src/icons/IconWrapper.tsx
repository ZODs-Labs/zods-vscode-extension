import React, { SVGProps } from 'react';

import { Box } from '@chakra-ui/react';

type IconProps = SVGProps<SVGSVGElement> & {
   height?: number | string;
   width?: number | string;
   className?: string;
   color?: string;
   stroke?: string;
   gProps?: any;
};

const withIconProps = (
   IconContent: React.FC<IconProps>,
   propsOverride?: Partial<IconProps>
) => {
   const Icon: React.FC<IconProps> = ({
      height,
      width,
      className = '',
      color,
      stroke,
      gProps = {},
      ...svgProps
   }) => (
      <Box fill={color}>
         <svg
            height={height || 25}
            width={width || 25}
            viewBox={propsOverride?.viewBox || '0 0 24 24'}
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            fill={propsOverride?.fill || ''}
            {...svgProps}
         >
            <IconContent
               {...{
                  ...gProps,
                  ...{ color, stroke },
               }}
            />
         </svg>
      </Box>
   );

   Icon.displayName = `withIconProps(${getDisplayName(IconContent)})`;

   return Icon;
};

function getDisplayName(WrappedComponent: React.ComponentType): string {
   return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withIconProps;
