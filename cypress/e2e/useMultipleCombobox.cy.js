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
  beforeEach(() => {
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

  it('can filter the items', () => {
    cy.get('[data-testid="shadow-root"]')
      .shadow()
      .within(() => {
        cy.findByRole('button', {name: 'toggle menu'}).click()
        cy.findAllByRole('option').should('have.length', 12)
        cy.findByRole('combobox').type('g')
        cy.findByRole('button', {name: 'toggle menu'}).should(
          'have.attr',
          'aria-expanded',
          'true',
        )
        cy.findAllByRole('option').should('have.length', 2)
        cy.findByText('Green').should('be.visible')
        cy.findByText('Gray').should('be.visible')

        cy.findByRole('combobox').type('{backspace}')
        cy.findAllByRole('option').should('have.length', 12)
      })
  })
})
