import {
  createStore,
  combineReducers,
  Store,
  Reducer,
  ReducersMapObject
} from 'redux'
import { Action } from '@core/interfaces'

const DESTROY_SESSION = '[INTERNAL] DESTROY_SESSION'

/**
 * Dictionary of reducers which are available
 * due to modules adding themselves to the
 * store as they are loaded
 */
const asyncReducers: ReducersMapObject = {}

/**
 * Reducers that are always available
 *
 * We should prefer the asyncReducers pattern as it
 * better supports code-splitting and general
 * flexibility
 */
const staticReducers: ReducersMapObject = {}

/**
 * Create store primary reducer using current state
 * of staticReducers and asyncReducers
 *
 * The store primary reducer is a master-list of all reducers
 * present in the application, these will be delegated
 * actions to parse as they are dispatched within the
 * application
 *
 * When asyncReducers changes, you should update the master
 * list by replacing the stores primary reducer
 *
 * You can do this by calling this function again - you can
 * see how this is implemented in injectReducer()
 *
 * @function createAppReducer
 */
const createAppReducer: any = () => {
  const reducers: ReducersMapObject = { ...staticReducers, ...asyncReducers }
  const reducersIsEmpty = Boolean(Object.keys(reducers).length === 0)

  return reducersIsEmpty
    ? () => {}
    : combineReducers(reducers)
}

/**
 * Create root-level reducer, the first reducer
 * an action will pass through before being delegated
 * to other reducers.
 *
 * We do this so that we may trigger a destroy event
 * and tell all other reducers to set their state
 * back to default - useful for test cleanup or managing
 * state between multiple sessions (when a user logs
 * out for example)
 *
 * @function createRootReducer
 */
const createRootReducer: any = (appReducer): Reducer => (state, action) => {
  if (action.type === DESTROY_SESSION) return appReducer(undefined, action)
  return appReducer(state, action)
}

/**
 * The redux store singleton
 */
export const store: Store = createStore(
  createRootReducer(createAppReducer()),
  // https://github.com/zalmoxisus/redux-devtools-extension#usage
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

/**
 * Inject a new reducer into the store asyncronously
 *
 * This allows reducers to add themselves to the store
 * at a time which they see fit. This async reducer
 * paradigm enables better code-splitting by allowing
 * reducers (and the module they belong to) to be
 * loaded on demand/lazy loaded
 *
 * @function injectReducer
 */
export const injectReducer = (key: string, reducer: Reducer): void => {
  asyncReducers[key] = reducer
  store.replaceReducer(createRootReducer(createAppReducer()))
}

/**
 * Dispatch an event to be consumed by the
 * redux store
 *
 * @function dispatch
 */
export const { dispatch } = store

/**
 * Reset store to initial state, removing all modifications
 * made to state during current session
 *
 * @function destroyStoreSession
 */
export const destroyStoreSession = (): Action => dispatch({ type: DESTROY_SESSION })
