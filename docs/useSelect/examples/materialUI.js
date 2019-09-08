import {makeStyles} from '@material-ui/core/styles'
import ImageIcon from '@material-ui/icons/Image'
import WorkIcon from '@material-ui/icons/Work'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'
import Cake from '@material-ui/icons/Cake'
import Group from '@material-ui/icons/Group'
import DirectionsCar from '@material-ui/icons/DirectionsCar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 150,
    overflowY: 'auto',
    position: 'absolute',
    margin: 0,
    borderTop: 0,
    zIndex: 1000,
  },
  highlighted: {
    backgroundColor: '#bde4ff',
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}))
const items = [
  {
    primary: 'Photos',
    secondary: 'Jan 9, 2014',
    icon: ImageIcon,
  },
  {
    primary: 'Work',
    secondary: 'Jan 7, 2014',
    icon: WorkIcon,
  },
  {
    primary: 'Vacation',
    secondary: 'July 20, 2014',
    icon: BeachAccessIcon,
  },
  {
    primary: 'Birthday',
    secondary: 'July 22, 2014',
    icon: Cake,
  },
  {
    primary: 'Friends',
    secondary: 'August 12, 2014',
    icon: Group,
  },
  {
    primary: 'New Car',
    secondary: 'September 1, 2014',
    icon: DirectionsCar,
  },
]

export {items, useStyles}
