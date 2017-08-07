/*
 * This file is here to make downshift compatible with
 * preact without requiring you to include all of preact-compat
 */
import preact from 'preact'

preact.Children = {
  only(children) {
    return children && children[0]
  },
}

const Children = preact.Children

export default preact
export * from 'preact'
export {Children}
