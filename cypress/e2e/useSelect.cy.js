describe('useSelect', () => {
  before(() => {
    cy.visit('/useSelect')
  })

  it('can open and close a menu', () => {
    cy.findByRole('combobox')
      .click()
    cy.findAllByRole('option')
      .should('have.length.above', 0)
    cy.findByRole('combobox')
      .click()
    cy.findAllByRole('option')
      .should('have.length', 0)
    cy.findByRole('combobox')
      .click()
    cy.findAllByRole('option')
      .should('have.length.above', 0)
  })
})
