export const SET_LOGIN_STATE = 'SET_LOGIN_INFO'

export type LoginState = boolean

export interface AppState {
    isLoggedIn: LoginState
}

export interface SetLoginAction {
    type: typeof SET_LOGIN_STATE
    newState: LoginState
}

export type ActionTypes = SetLoginAction
