describe('combobox', () => {
  before(() => {
    cy.visit('/tests/combobox')
  })

  beforeEach(() => {
    cy.getByTestId('clear-button').click()
  })

  it('can select an item', () => {
    cy.getByTestId('combobox-input')
      .type('ee{downarrow}{enter}')
      .should('have.value', 'Green')
  })

  it('can up arrow to select last item', () => {
    cy.getByTestId('combobox-input')
      .type('{uparrow}{enter}') // open menu, last option is focused
      .should('have.value', 'Purple')
  })

  it('can up arrow down select first item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{enter}') // open menu, first option is focused
      .should('have.value', 'Black')
  })

  it('can down arrow to select an item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{downarrow}{enter}') // open and select second item
      .should('have.value', 'Red')
  })

  it('resets the item on blur', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{enter}') // open and select first item
      .should('have.value', 'Black')
      .get('body')
      .click()
      .getByTestId('combobox-input')
      .should('have.value', 'Black')
  })

  it('can use the mouse to click an item', () => {
    cy.getByTestId('combobox-input')
      .type('red')
      .getByTestId('downshift-item-0')
      .click()
      .getByTestId('combobox-input')
      .should('have.value', 'Red')
  })

  it('does not reset the input when mouseup outside while the input is focused', () => {
    cy.getByTestId('combobox-input')
      .type('red')
      .getByTestId('downshift-item-0')
      .click()
      .getByTestId('combobox-input')
      .should('have.value', 'Red')
      .type('{backspace}{backspace}')
      .should('have.value', 'R')
      .click()
      .get('body')
      .trigger('mouseup')
      .getByTestId('combobox-input')
      .should('have.value', 'R')
      .blur()
      .get('body')
      .trigger('click')
      .getByTestId('combobox-input')
      .should('have.value', 'Red')
  })

  it('resets when bluring the input', () => {
    cy.getByTestId('combobox-input')
      .type('re')
      .blur()
      // https://github.com/kentcdodds/cypress-testing-library/issues/13
      .wait(1)
      .queryByTestId('downshift-item-0', {timeout: 10})
      .should('not.be.visible')
  })

  it('does not reset when tabbing from input to the toggle button', () => {
    cy.getByTestId('combobox-input')
      .type('pu')
      .getByTestId('toggle-button')
      .focus()
      .getByTestId('downshift-item-0')
      .click()
      .getByTestId('combobox-input')
      .should('have.value', 'Purple')
  })

  it('does not reset when tabbing from the toggle button to the input', () => {
    cy.getByTestId('toggle-button')
      .click()
      .getByTestId('combobox-input')
      .focus()
      .getByTestId('downshift-item-0')
      .click()
      .getByTestId('combobox-input')
      .should('have.value', 'Black')
  })

  it('resets when tapping outside on a touch screen', () => {
    cy.getByTestId('combobox-input')
      .type('re')
      .get('body')
      .trigger('touchstart')
      .trigger('touchend')
      .queryByTestId('downshift-item-0', {timeout: 10})
      .should('not.be.visible')
  })

  it('does not reset when swiping outside to scroll a touch screen', () => {
    cy.getByTestId('combobox-input')
      .type('re')
      .get('body')
      .trigger('touchstart')
      .trigger('touchmove')
      .trigger('touchend')
      .queryByTestId('downshift-item-0', {timeout: 10})
      .should('be.visible')
  })
})
