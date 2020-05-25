import { Dictionary } from '@core/interfaces'

/**
 * Base class for services
 *
 * CoreService is a redux-aware stateful entity
 * @class CoreService
 */
export class CoreService<T> {
  context: T
  store: any

  constructor (store) {
    this.onStateChange = this.onStateChange.bind(this)
    this.store = store

    store.subscribe(this.onStateChange)
  }

  getContext (_: Dictionary<any>): (T | {}) {
    return {}
  }

  onStateChange (): void {
    this.context = {
      ...this.context,
      ...this.getContext(this.store.getState())
    }
  }
}

/**
 * Interface for services
 *
 * All services should implement Service
 * which asserts getContext() has been
 * implemented correctly
 */
export interface Service<T> {
  getContext?: (state: Dictionary<any>) => T
}
