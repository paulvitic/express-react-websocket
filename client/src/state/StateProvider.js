import React, {createContext, useContext, useReducer} from 'react';

const socket = new WebSocket("ws://localhost:3000");
socket.onerror = (event) => {
    console.error("WebSocket error observed:", event);
};
socket.onopen = (event) => {
    socket.send("Here's some text that the server is urgently awaiting!");
    socket.send("broadcast: Here's some text that the other clients are urgently awaiting!");
};
socket.onmessage = (event) => {
    console.log(event.data);
};

const StateContext = createContext();

// useReducer accepts reducer function of type (state, action) => newState,
// and returns the current state paired with a dispatch method.
export const StateProvider = ({reducer, initialState, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)} >
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext); // returns the current context value for StateContext
