import { useMemo } from 'react';

import { Flex } from '@chakra-ui/react';

import {
   StateKeys,
   StateProvider,
   useTempState,
   useVSCodePostMessageListener,
} from '@zods/webview-core';

import './App.scss';
import SettingsPanel from './components/settings/SettingsPanel';
import { PanelsMap } from './shared/constants/panels.map';
import { PanelType } from './shared/enums/panel-type.enum';

const AppContent = () => {
   useVSCodePostMessageListener();
   const { getTempStateValue } = useTempState();
   const activePanelType =
      getTempStateValue(StateKeys.ActivePanelType) || PanelType.AIChat;

   const isSettingsPanelOpen = getTempStateValue(
      StateKeys.IsSettingsPanelOpened
   );

   const ActivePanel = useMemo(
      () => (activePanelType ? (PanelsMap as any)[activePanelType] : <></>),
      [activePanelType]
   );

   return (
      <Flex h='100vh' w='100vw' justify='center' align='center'>
         <ActivePanel />
         {isSettingsPanelOpen && <SettingsPanel />}
      </Flex>
   );
};

const App = () => {
   return (
      <StateProvider>
         <AppContent />
      </StateProvider>
   );
};

export default App;
