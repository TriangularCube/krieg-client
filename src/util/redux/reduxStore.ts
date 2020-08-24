import { createStore, combineReducers } from 'redux'
import { RootReducer } from './reduxReducers'

export const store = createStore(combineReducers(RootReducer))
export const dispatch = store.dispatch
