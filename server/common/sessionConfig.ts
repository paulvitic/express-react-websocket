import uid from 'uid-safe';
import {Application} from "express";

const sessionConfig = (app: Application) => {
    const sess ={
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        genid: function(req) {
            return uid.sync(18) // use UUIDs for session IDs
        },
        cookie: {
            maxAge: 60000,
            secure: false
        }
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }

    return sess;
};

export default sessionConfig;
