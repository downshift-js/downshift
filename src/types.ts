import React from 'react'

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
export type AnyRef = React.Ref<any>

export interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
  Node: typeof window.Node
}

export interface GetPropsCommonOptions {
  suppressRefError?: boolean
}
