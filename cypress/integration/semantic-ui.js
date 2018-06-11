describe('Semantic-UI', () => {
  before(() => {
    cy.visitStory('semantic-ui')
  })

  beforeEach(() => {
    cy.getInStoryByTestId('semantic-ui-input').type('{selectAll}{del}')
  })

  afterEach(() => {
    cy.getInStoryByTestId('semantic-ui-clear-button').click()
  })

  it('does not reset when tabbing from input to button', () => {
    cy.getInStoryByTestId('semantic-ui-input')
      .type('Alg')
      .getInStoryByTestId('semantic-ui-toggle-button')
      .focus()
      .getInStoryByTestId('downshift-item-0')
      .click()
      .getInStoryByTestId('semantic-ui-input')
      .should('have.value', 'Algeria')
  })

  it('does not reset when tabbing from button to input', () => {
    cy.getInStoryByTestId('semantic-ui-toggle-button')
      .click()
      .getInStoryByTestId('semantic-ui-input')
      .focus()
      .getInStoryByTestId('downshift-item-0')
      .click()
      .getInStoryByTestId('semantic-ui-input')
      .should('have.value', 'Afghanistan')
  })
})
