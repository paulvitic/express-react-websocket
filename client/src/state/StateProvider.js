import React, {createContext, useCallback, useContext, useReducer, useMemo} from 'react';
import {mainReducer} from "../reducers";
import {createSocket} from "./webSocket";

const StateContext = createContext();

// useReducer accepts reducer function of type (state, action) => newState,
// and returns the current state paired with a dispatch method.
export const StateProvider = ({initialState, children}) => {
    console.log("state provider invoked.");
    const [state, dispatch] = useReducer(mainReducer, initialState);

    useMemo(() => {
            console.log("use memo called");
            createSocket(dispatch);
        }
        , [dispatch]
    );

/*    const push = useCallback(() => {
        console.log("use callback called");
        createSocket(dispatch);
    }, [sid]);*/

    return (
        <StateContext.Provider value={[state, dispatch]}>
            {children}
        </StateContext.Provider>
    )
};

export const useStateValue = () => useContext(StateContext); // returns the current context value for StateContext
