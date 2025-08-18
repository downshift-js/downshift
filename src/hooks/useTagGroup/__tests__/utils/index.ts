export * from '@testing-library/react'

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

export {defaultProps} from './defaultProps'
export {renderTagGroup} from './renderTagGroup'
export {renderUseTagGroup} from './renderUseTagGroup'
export {defaultIds} from './defaultIds'
