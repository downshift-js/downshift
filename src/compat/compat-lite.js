export * from 'preact'
import preact from 'preact'

export const Children = (preact.Children = {
  only(children) {
    return children && children[0]
  },
  count(children) {
    return children ? children.length : 0
  },
})

export default preact
