describe('useSelect', () => {
  before(() => {
    cy.visit('/useselect')
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
