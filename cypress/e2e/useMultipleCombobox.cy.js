describe('useMultipleCombobox', () => {
  before(() => {
    cy.visit('/useMultipleCombobox')
  })

  it('can select multiple items', () => {
    cy.findByRole('button', {name: 'toggle menu'}).click()
    cy.findByRole('option', {name: 'Green'}).click()
    cy.findByRole('option', {name: 'Gray'}).click()
    cy.findByRole('button', {name: 'toggle menu'}).click()
    cy.findByText('Black').should('be.visible')
    cy.findByText('Red').should('be.visible')
    cy.findByText('Green').should('be.visible')
    cy.findByText('Gray').should('be.visible')
  })
})
