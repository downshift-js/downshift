// eslint-disable-next-line import/no-unassigned-import
import './raf-polyfill'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter: new Adapter()})
