import {Application} from "express";
import session from "express-session";
import uuid from "uuid";

const sessionConfig = (app: Application) => {

/*    const sess ={
        store: app.get('sessionStore'),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        genid: function(req) {
            return uid.sync(18) // use UUIDs for session IDs
        },
        cookie: {
            maxAge: 360000,
            secure: false
        }
    };*/

    const sess = {
        name: 'amp',
        secret: process.env.SESSION_SECRET,
        store: app.get('sessionStore'),
        cookie: {
            expires: new Date(new Date().getTime() + 360000000),
            httpOnly: false,
            secure: false,
            maxAge: 360000000
        },
        genid: function(req) {
            return uuid.v4();
        },
        saveUninitialized: true,
        resave: false,
        rolling: true
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy, this is not about session config or?
        sess.cookie.secure = true // serve secure cookies
    }

    app.use(session(sess));
};

export default sessionConfig;

