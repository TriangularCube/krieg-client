import { LoginState, SET_LOGIN_STATE, SetLoginAction } from './types'
import { LoggedInKey } from './constants'

export const setLoginState = (newState: LoginState): SetLoginAction => {
    localStorage.setItem(LoggedInKey, newState.toString())
    return {
        type: SET_LOGIN_STATE,
        newState,
    }
}
