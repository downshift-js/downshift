describe('useMultipleSelect', () => {
  before(() => {
    cy.visit('/useMultipleSelect')
  })

  it('can select multiple options', () => {
    cy.findByRole('combobox').click()
    cy.findByRole('option', {name: 'Green'}).click()
    cy.findByRole('option', {name: 'Blue'}).click()
    cy.findByRole('combobox').click()
    cy.findByText('Black').should('be.visible')
    cy.findByText('Red').should('be.visible')
    cy.findByText('Green').should('be.visible')
    cy.findByText('Blue').should('be.visible')
  })
})
