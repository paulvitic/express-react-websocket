import { themeReducer } from './themeReducer';

export const mainReducer = ({theme}, action) => {
    // middleware goes here, i.e calling analytics service, etc.

    console.log("at main reducer action is:");
    console.log(action);
    console.log("at main reducer theme state is:");
    console.log(theme);

    return {
        theme: themeReducer(theme, action),
    };
};
