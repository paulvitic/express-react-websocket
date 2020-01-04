import { themeReducer } from './themeReducer';
import {DO_NOTHING} from "./actionTypes";
import {createSocket} from "../state/webSocket";


export const mainReducer = (state, action) => {
    // middleware goes here, i.e calling analytics service, etc.
    console.log(`state is ${JSON.stringify(state)}, action is ${JSON.stringify(action)}`);
    const { theme } = state;

    if(action.type === DO_NOTHING){
        return state;
    } else {
        return {
            ...state,
            theme: themeReducer(theme, action),
        };
    }
};
