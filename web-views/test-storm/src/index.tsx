import React from 'react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import ReactDOM from 'react-dom/client';

import App from './App';
import './highlight-vs2015.min.css';
import './index.scss';
import theme from './theme/theme';

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);
root.render(
   <React.StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
         <App />
      </ChakraProvider>
   </React.StrictMode>
);
