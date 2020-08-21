import React, { FC, ReactElement, ReactNode, useState } from 'react'
import PropTypes from 'prop-types'

const LoggedInKey = 'Krieg-API-Logged-In-State'
export const LoginContext = React.createContext(null)

export const WithLoginContext: FC<{
    children?: ReactNode
}> = ({ children }): ReactElement => {
    const [isLoggedIn, setLoggedInState] = useState(
        localStorage.getItem(LoggedInKey) ?? false
    )
    const [accessToken, setAccessToken] = useState(null)

    const setLoggedIn = (newState: boolean): void => {
        localStorage.setItem(LoggedInKey, newState.toString())
        setLoggedInState(newState)
    }

    return (
        <LoginContext.Provider
            value={{
                isLoggedIn,
                setLoggedIn,
                accessToken,
                setAccessToken,
            }}
        >
            {children}
        </LoginContext.Provider>
    )
}

WithLoginContext.propTypes = {
    children: PropTypes.node.isRequired,
}
