import React, {
   createContext,
   useContext,
   useReducer,
   Dispatch,
   useEffect,
} from 'react';

import { StateKeys } from '../constants';

export interface StateUpdateAction extends StateAction {
   callback: (state: any) => any;
}

export interface State {
   authToken: string | null;
   aiChatCodeContext: string;
   actionQueue: StateUpdateAction[];
   [key: string]: any;
}

const ActionKeys = {
   SetKeyValue: 'SET_KEY_VALUE',
   SetState: 'SET_STATE',
   EnqueueStateUpdate: 'ENQUEUE_STATE_UPDATE',
   DequeueStateUpdate: 'DEQUEUE_STATE_UPDATE',
};

const DefaultState: State = {
   authToken: null,
   aiChatCodeContext: '',
   actionQueue: [],
};

type StateAction = { type: string; key?: string; value?: any; callback?: any };

interface StateContext {
   state: State;
   isAuthenticated: boolean;
   dispatch: Dispatch<StateAction>;
   getTempStateValue: (key: string) => any;
   setTempStateValue: (key: string, value: any) => void;
   setTempStateCallback: (
      key: string,
      callback: (currentValue: any) => any
   ) => void;
   setTempState: (callback: (state: State) => State) => void;

   /**
    * Enqueue a state update to be processed in the next render cycle.
    * @param key State key to update.
    * @param callback Callback function that receives the current state value and returns the new state value.
    */
   enqueueStateUpdate: (key: string, callback: (val: any) => any) => void;
}

const StateContext = createContext<StateContext>({} as any);

const StateReducer = (state: State, action: StateAction) => {
   switch (action.type) {
      case ActionKeys.SetKeyValue:
         return { ...state, [action.key]: action.value };
      case ActionKeys.SetState:
         return { ...action.value };
      case ActionKeys.EnqueueStateUpdate:
         return {
            ...state,
            actionQueue: [...state.actionQueue, action as StateUpdateAction],
         };
      case ActionKeys.DequeueStateUpdate:
         return {
            ...state,
            actionQueue: state.actionQueue.slice(1),
         };
      default:
         throw new Error(`Unhandled action type`);
   }
};

export const StateProvider: React.FC<{
   children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
   const [state, dispatch] = useReducer(StateReducer, DefaultState);

   useEffect(() => {
      if (state.actionQueue.length > 0) {
         const nextAction = state.actionQueue[0];

         if (nextAction.type === ActionKeys.EnqueueStateUpdate) {
            const currentValue = state[nextAction.key];
            const newValue = nextAction.callback(currentValue);

            dispatch({
               type: ActionKeys.SetKeyValue,
               key: nextAction.key,
               value: newValue,
            });
         }

         dispatch({ type: ActionKeys.DequeueStateUpdate });
      }
   }, [state.actionQueue, dispatch]);

   const setTempStateValue = (key: string, value: any) => {
      dispatch({ type: ActionKeys.SetKeyValue, key, value });
   };

   const setTempStateCallback = (
      key: string,
      callback: (currentValue: any) => any
   ) => {
      const currentValue = state[key];
      const newValue = callback(currentValue);
      dispatch({ type: ActionKeys.SetKeyValue, key, value: newValue });
   };

   const setTempState = (callback: (state: State) => State) => {
      const newState = callback(state);
      dispatch({ type: ActionKeys.SetState, value: newState });
   };

   const getTempStateValue = (key: string) => {
      return state[key];
   };

   const enqueueStateUpdate = (key: string, callback: (val: any) => any) => {
      dispatch({
         type: ActionKeys.EnqueueStateUpdate,
         key,
         value: callback,
         callback,
      });
   };

   return (
      <StateContext.Provider
         value={{
            state,
            isAuthenticated: !!state[StateKeys.AuthToken],
            dispatch,
            getTempStateValue,
            setTempStateValue,
            setTempStateCallback,
            setTempState,
            enqueueStateUpdate,
         }}
      >
         {children}
      </StateContext.Provider>
   );
};

// Extend KeyValueContext.tsx
export const useTempState = () => {
   const context = useContext(StateContext);
   if (!context) {
      throw new Error('useKeyValue must be used within a KeyValueProvider');
   }

   return context;
};
