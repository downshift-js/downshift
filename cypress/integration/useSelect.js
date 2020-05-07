describe('useSelect', () => {
  before(() => {
    cy.visit('/')
    cy.findByText(/^Tests$/).click()
    cy.findByText(/^useSelect$/, {selector: '[href="/tests/use-select"]'}).click()
  })

  it('can open and close a menu', () => {
    cy.findByTestId('select-toggle-button')
      .click()
    cy.findAllByRole('option')
      .should('have.length.above', 0)
    cy.findByTestId('select-toggle-button')
      .click()
    cy.findAllByRole('option')
      .should('have.length', 0)
    cy.findByTestId('select-toggle-button')
      .click()
    cy.findAllByRole('option')
      .should('have.length.above', 0)
  })
})
