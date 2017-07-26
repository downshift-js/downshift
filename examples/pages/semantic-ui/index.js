import React from 'react'
import matchSorter from 'match-sorter'
import glamorous, {Div} from 'glamorous'
import items from '../../other/countries'
import Autocomplete from '../../other/react-autocompletely'

export default Examples

function Examples() {
  return (
    <div>
      semantic-ui examples
      <Div
        css={{
          margin: '50px auto',
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <p>This is still a work in progress.</p>
        <Div display="flex" justifyContent="center">
          <SemanticUIAutocomplete />
        </Div>
      </Div>
    </div>
  )
}

const Item = glamorous(Autocomplete.Item, {
  rootEl: 'div',
  forwardProps: ['index', 'item'],
})(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({isActive, isSelected}) => {
    const styles = []
    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }
    return styles
  },
)
const onAttention = '&:hover, &:focus'
const Input = glamorous(Autocomplete.Input, {
  rootEl: 'input',
  forwardProps: ['getValue'],
})(
  {
    width: 'calc(100% - 16px)', // full width - icon width/2 - border
    fontSize: 14,
    wordWrap: 'break-word',
    lineHeight: '1em',
    outline: 0,
    whiteSpace: 'normal',
    minHeight: '2em',
    background: '#fff',
    display: 'inline-block',
    padding: '.5em 2em .5em 1em',
    color: 'rgba(0,0,0,.87)',
    boxShadow: 'none',
    border: '1px solid rgba(34,36,38,.15)',
    borderRadius: '.30rem',
    transition: 'box-shadow .1s ease,width .1s ease',
    ':hover': {
      borderColor: 'rgba(34,36,38,.35)',
      boxShadow: 'none',
    },
    [onAttention]: {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  },
  ({isOpen}) =>
    (isOpen ?
      {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
      } :
      null),
)

const Menu = glamorous(Autocomplete.Menu, {
  rootEl: 'div',
  forwardProps: ['defaultHighlightedIndex'],
})({
  maxHeight: '20rem',
  overflowY: 'auto',
  overflowX: 'hidden',
  borderTopWidth: '0',
  outline: '0',
  borderRadius: '0 0 .28571429rem .28571429rem',
  transition: 'opacity .1s ease',
  boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
  borderColor: '#96c8da',
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderStyle: 'solid',
})

const ControllerButton = glamorous.button({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 8,
  top: 12,
  cursor: 'pointer',
})

function advancedFilter(theItems, value) {
  return matchSorter(theItems, value, {
    keys: ['name', 'code'],
  })
}

function SemanticUIAutocomplete() {
  return (
    <Autocomplete
      onChange={item => alert(item.name)}
      style={{
        width: '250px',
      }}
    >
      <Autocomplete.Controller>
        {({isOpen, toggleMenu, clearSelection, selectedItem}) =>
          (<Div position="relative" css={{paddingRight: '1.75em'}}>
            <Input
              getValue={i => i.name}
              isOpen={isOpen}
              placeholder="Enter some info"
            />
            {selectedItem ?
              <ControllerButton
                css={{paddingTop: 4}}
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <XIcon />
              </ControllerButton> :
              <ControllerButton
                onClick={toggleMenu}
                aria-label={isOpen ? 'close menu' : 'open menu'}
              >
                <ArrowIcon isOpen={isOpen} />
              </ControllerButton>}
          </Div>)}
      </Autocomplete.Controller>
      <Menu defaultHighlightedIndex={0}>
        {({inputValue, highlightedIndex, selectedItem}) =>
          // prettier-ignore
          (inputValue ? advancedFilter(items, inputValue) : items)
            .map((item, index) => (
              <Item
                item={item}
                index={index}
                key={item.code}
                isActive={highlightedIndex === index}
                isSelected={selectedItem === item}
              >
                {item.name}
              </Item>
            ))}
      </Menu>
    </Autocomplete>
  )
}

function ArrowIcon({isOpen}) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}
