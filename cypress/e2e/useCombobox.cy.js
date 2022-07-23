describe('useCombobox', () => {
  before(() => {
    cy.visit('/usecombobox')
  })

  it('should keep focus on the input when selecting by click', () => {
    cy.findByTestId('combobox-toggle-button').click()
    cy.findByTestId('downshift-item-0').click()
    cy.findByTestId('combobox-input').should('have.focus')
  })
})
