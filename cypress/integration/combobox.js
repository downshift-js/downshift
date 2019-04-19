// the combobox happens to be in the center of the page.
// without specifying an x and y for the body events
// we actually wind up firing events on the combobox.
const bodyX = 100
const bodyY = 300

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

  it('can arrow up to select last item', () => {
    cy.getByTestId('combobox-input')
      .type('{uparrow}{enter}') // open menu, last option is focused
      .should('have.value', 'Purple')
  })

  it('can arrow down to select first item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{enter}') // open menu, first option is focused
      .should('have.value', 'Black')
  })

  it('can down arrow to select an item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{downarrow}{enter}') // open and select second item
      .should('have.value', 'Red')
  })

  /* should be enabled if https://github.com/cypress-io/cypress/pull/3071 gets released.
  it('can use home arrow to select first item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{downarrow}{home}{enter}') // open to first, go down to second, return to first by home.
      .should('have.value', 'Black')
  })

  it('can use end arrow to select last item', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{end}{enter}') // open to first, go to last by end.
      .should('have.value', 'Purple')
  })
  */

  it('resets the item on blur', () => {
    cy.getByTestId('combobox-input')
      .type('{downarrow}{enter}') // open and select first item
      .should('have.value', 'Black')
      .get('body')
      .click(bodyX, bodyY)
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
      .trigger('mouseup', bodyX, bodyY)
      .getByTestId('combobox-input')
      .should('have.value', 'R')
      .blur()
      .get('body')
      .trigger('click', bodyX, bodyY)
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
      .trigger('touchstart', bodyX, bodyY)
      .trigger('touchend', bodyX, bodyY)
      .queryByTestId('downshift-item-0', {timeout: 10})
      .should('not.be.visible')
  })

  it('does not reset when swiping outside to scroll a touch screen', () => {
    cy.getByTestId('combobox-input')
      .type('re')
      .get('body')
      .trigger('touchstart', bodyX, bodyY)
      .trigger('touchmove', bodyX, bodyY + 20)
      .trigger('touchend', bodyX, bodyY + 20)
      .queryByTestId('downshift-item-0', {timeout: 10})
      .should('be.visible')
  })
})
