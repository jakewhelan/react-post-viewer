export interface Action {
  type: string
  payload?: any
}

export interface Dictionary<T> {
  [key: string]: T
}
