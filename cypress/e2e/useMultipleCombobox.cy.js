describe('useMultipleCombobox', () => {
  before(() => {
    cy.visit('/useMultipleCombobox')
  })

  it('can select multiple items', () => {
    cy.findByRole('button', {name: 'toggle menu'}).click()
    cy.findByRole('option', {name: 'Green'}).click()
    cy.findByRole('button', {name: 'toggle menu'}).should(
      'have.attr',
      'aria-expanded',
      'true',
    )
    cy.findByRole('option', {name: 'Gray'}).click()
    cy.findByRole('button', {name: 'toggle menu'}).click()
    cy.findByRole('button', {name: 'toggle menu'}).should(
      'have.attr',
      'aria-expanded',
      'false',
    )
    cy.findByText('Black').should('be.visible')
    cy.findByText('Red').should('be.visible')
    cy.findByText('Green').should('be.visible')
    cy.findByText('Gray').should('be.visible')
  })
})

describe('useMultipleCombobox in shadow DOM', () => {
  before(() => {
    cy.visit('/shadow-dom/useMultipleCombobox')
  })

  it('can select multiple items within a shadow DOM', () => {
    cy.get('[data-testid="shadow-root"]')
      .shadow()
      .within(() => {
        cy.findByRole('button', {name: 'toggle menu'}).click()
        cy.findByRole('option', {name: 'Green'}).click()
        cy.findByRole('button', {name: 'toggle menu'}).should(
          'have.attr',
          'aria-expanded',
          'true',
        )
        cy.findByRole('option', {name: 'Gray'}).click()
        cy.findByRole('button', {name: 'toggle menu'}).click()
        cy.findByRole('button', {name: 'toggle menu'}).should(
          'have.attr',
          'aria-expanded',
          'false',
        )
        cy.findByText('Black').should('be.visible')
        cy.findByText('Red').should('be.visible')
        cy.findByText('Green').should('be.visible')
        cy.findByText('Gray').should('be.visible')
      })
  })
})
