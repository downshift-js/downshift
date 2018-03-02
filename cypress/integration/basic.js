describe('Basic', () => {
  before(() => {
    cy.visitStory('basic')
  })

  beforeEach(() => {
    cy.getInStoryByTestId('clear-selection').click()
  })

  it('can select an item', () => {
    cy
      .getInStoryByTestId('basic-input')
      .type('ee{downarrow}{enter}')
      .should('have.value', 'Green')
  })

  it('can down arrow to select an item', () => {
    cy
      .getInStoryByTestId('basic-input')
      .type('{downarrow}') // open menu
      .type('{downarrow}{downarrow}{enter}') // select second item
      .should('have.value', 'Red')
  })

  it('resets the item on blur', () => {
    cy
      .getInStoryByTestId('basic-input')
      .type('{downarrow}{downarrow}{enter}{backspace}') // select first item
      .should('have.value', 'Black')
      .getInStory('body')
      .click()
      .getInStoryByTestId('basic-input')
      .should('have.value', 'Black')
  })

  it('can use the mouse to click an item', () => {
    cy
      .getInStoryByTestId('basic-input')
      .type('red')
      .getInStoryByTestId('downshift-item-0')
      .click()
      .getInStoryByTestId('basic-input')
      .should('have.value', 'Red')
  })

  it('does not reset the input when mouseup outside while the input is focused', () => {
    cy
      .getInStoryByTestId('basic-input')
      .type('red')
      .getInStoryByTestId('downshift-item-0')
      .click()
      .getInStoryByTestId('basic-input')
      .should('have.value', 'Red')
      .type('{backspace}{backspace}')
      .should('have.value', 'R')
      .click()
      .get('body')
      .trigger('mouseup')
      .getInStoryByTestId('basic-input')
      .should('have.value', 'R')
      .blur()
      .get('body')
      .trigger('click')
      .getInStoryByTestId('basic-input')
      .should('have.value', 'Red')
  })
})
