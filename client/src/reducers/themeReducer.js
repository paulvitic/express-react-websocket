export const themeReducer = (currentTheme, action) => {

    console.log("at theme reducer action is:");
    console.log(action);
    console.log("at theme reducer state is:");
    console.log(currentTheme);

    switch (action.type) {
        case 'changeTheme':
            return action.newTheme;
        default:
            return currentTheme;
    }
};
