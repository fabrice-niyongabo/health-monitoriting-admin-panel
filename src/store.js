import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'health-mon-key-3211',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(Store)
