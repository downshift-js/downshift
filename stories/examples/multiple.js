import React, {Component} from 'react'
import glamorous, {Div} from 'glamorous'
import matchSorter from 'match-sorter'
import Downshift from '../../src'

class Examples extends Component {
  state = {
    selectedColors: [],
  }

  changeHandler = selectedColors => {
    this.setState({selectedColors})
  }

  render() {
    const items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

    return (
      <div>
        <Div
          css={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>multiple example</h2>
          <Div display="flex" justifyContent="center">
            <MultipleAutocomplete
              values={this.state.selectedColors}
              items={items}
              onChange={this.changeHandler}
            />
          </Div>
        </Div>
      </div>
    )
  }
}

const Label = glamorous.label({fontWeight: 'bold', display: 'block'})

const Item = glamorous.div(
  {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
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
    boxSizing: 'border-box',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({isActive, isSelected}) => ({
    opacity: isSelected ? 0.5 : 1,
    backgroundColor: isActive ? 'lightgrey' : 'white',
    '&:hover, &:focus': {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  }),
)

const ItemLabel = glamorous.span({
  display: 'inlineBlock',
  padding: '4px 6px',
  color: '#fff',
  background: '#ddd',
  textTransform: 'uppercase',
  borderRadius: 'borderRadius',
  marginLeft: 'auto',
  fontSize: 10,
})

const InputWrapper = glamorous.div({
  lineHeight: '1em',
  outline: 0,
  minHeight: '2em',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  padding: '.5em',
  border: '1px solid rgba(34,36,38,.15)',
  transition: 'box-shadow .1s ease,width .1s ease',
})

const Input = glamorous.input({
  fontSize: 14,
  wordWrap: 'break-word',
  outline: 0,
  whiteSpace: 'normal',
  background: 'transparent',
  display: 'inline-block',
  color: 'rgba(0,0,0,.87)',
  boxShadow: 'none',
  border: '0',
})

// this is just a demo of how you'd use the getRootProps function
// normally you wouldn't need this kind of abstraction 😉
function Root({innerRef, ...rest}) {
  return <div ref={innerRef} {...rest} />
}

class MultipleAutocomplete extends React.Component {
  state = {
    input: '',
  }

  render() {
    const {values} = this.props
    const {input} = this.state
    const items = input.length
      ? matchSorter(this.props.items, input)
      : this.props.items
    const indices = mapItemIndex(items, values)

    return (
      <Downshift
        inputValue={this.state.input}
        onChange={this.handleChange}
        selectedItem={values}
      >
        {({
          getInputProps,
          getItemProps,
          getRootProps,
          getLabelProps,
          highlightedIndex,
          isOpen,
          selectedItem,
        }) => (
          <Root {...getRootProps({refKey: 'innerRef'})}>
            <Label {...getLabelProps()}>What are your favorite colors?</Label>
            <InputWrapper>
              {selectedItem.map((value, i) => (
                <span
                  key={i}
                  style={{
                    height: '2em',
                    width: '2em',
                    padding: '.3em',
                    borderRadius: '5px',
                    marginRight: '.5em',
                    backgroundColor: value,
                  }}
                />
              ))}
              <Input
                {...getInputProps({
                  placeholder: 'Enter color here',
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                })}
              />
            </InputWrapper>

            {isOpen && (
              <div
                style={{
                  border: '1px solid rgba(34,36,38,.15)',
                  maxHeight: 400,
                  overflowY: 'scroll',
                }}
              >
                {items.map(item => {
                  const selected = this.props.values.indexOf(item) !== -1

                  const props = selected
                    ? {}
                    : getItemProps({
                        item,
                        index: indices[item],
                        isActive: highlightedIndex === indices[item],
                        isSelected: selected,
                      })

                  return (
                    <Item {...props} key={item}>
                      {item}
                      {selected && <ItemLabel>Selected</ItemLabel>}
                    </Item>
                  )
                })}
              </div>
            )}
          </Root>
        )}
      </Downshift>
    )
  }

  handleKeyDown = evt => {
    const {values} = this.props
    if (values.length && !this.state.input.length && evt.keyCode == 8) {
      this.props.onChange(values.slice(0, values.length - 1))
    }
  }

  handleInputChange = evt => {
    this.setState({input: evt.target.value})
  }

  handleChange = item => {
    this.props.onChange([...this.props.values, item])
    this.setState({input: ''})
  }
}

/**
 * Get the real index of an item.
 *
 * It does this filtering out selected values, and mapping the values to the index.
 * We're doing so that Downshift doesn't recognize selected item,
 * thus won't highlight the selected item.
 *
 * Given that ['Black', 'Blue', 'Green'], and 'Blue' is selected
 * Output: { 'Black': 0, 'Green': 1 }
 *
 * @param {String[]} items items
 * @param {String[]} values selected items
 * @return {Object} Mapping of selected items to their indices
 */
function mapItemIndex(items, values) {
  return items
    .filter(item => values.indexOf(item) === -1)
    .reduce((prev, next, i) => {
      prev[next] = i
      return prev
    }, {})
}

export default Examples
