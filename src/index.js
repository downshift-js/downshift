import Downshift from './downshift'
import {resetIdCounter} from './utils'

/*
 * Fix importing in typescript after rollup compilation
 * https://github.com/rollup/rollup/issues/1156
 * https://github.com/Microsoft/TypeScript/issues/13017#issuecomment-268657860
 */
Downshift.default = Downshift
Downshift.resetIdCounter = resetIdCounter

export const downshiftFactory = () => Downshift

export default Downshift
