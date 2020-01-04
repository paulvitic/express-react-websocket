import Cookie from "js-cookie";
import {CHANGE_THEME, DO_NOTHING} from "../reducers/actionTypes";

console.log("creating socket");
const socket = new WebSocket("ws://localhost:3000");

socket.onerror = (event) => {
    console.error("WebSocket error observed:", event);
};

socket.onopen = (event) => {
    socket.send(`${Cookie.get("app.sid")} connected`);
};

export const createSocket = (dispatch) => {
    console.log("invoked creat socket");
    socket.onmessage = (event) => {
        console.log(event.data);
        if (event.data.startsWith("server-connection:")) return;
        if (event.data.startsWith("action:")) dispatch({type:CHANGE_THEME, payload:'red'})
        // socket.send("broadcast: Message for other clients");
    };
};
