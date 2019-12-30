import React from 'react';
import styled from "styled-components";
import { useStateValue } from '../../state';

const StyledButton = styled.button`
    background-color: ${props => props.color};
`;

const Button = () => {
    const [{ theme }, dispatch] = useStateValue();

    console.log("at button theme is:");
    console.log(theme);

    return (
        <StyledButton
            color={theme.primary}
            onMouseOut={() => dispatch({
                type: 'changeTheme',
                newTheme: { primary: 'blue'}
            })}
            onClick={() => dispatch({
                type: 'changeTheme',
                newTheme: { primary: 'red'}
            })}
        >
            Make me blue!
        </StyledButton>
    );
};

export default Button;
