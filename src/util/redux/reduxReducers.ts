import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { SET_LOGIN_STATE, LoginState, ActionTypes, AppState } from './types'
import { Reducer } from 'redux'
import { LoggedInKey } from './constants'

/*
Reducers are combined in Store

Each function name is also the state name
*/

const isLoggedIn: Reducer<LoginState> = (
    state = (JSON.parse(localStorage.getItem(LoggedInKey)) as boolean) ?? false,
    action: ActionTypes
): boolean => {
    if (action.type === SET_LOGIN_STATE) {
        return action.newState
    }

    return state
}

export const RootReducer = {
    isLoggedIn,
}

export const useLoginSelector: TypedUseSelectorHook<AppState> = useSelector
