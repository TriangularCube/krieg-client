import { createStore, combineReducers } from 'redux'
import { RootReducer } from './reduxReducers'

const store = createStore(combineReducers(RootReducer))

export default store
