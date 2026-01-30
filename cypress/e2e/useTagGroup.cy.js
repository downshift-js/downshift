describe('useTagGroup', () => {
  const colors = ['Black', 'Red', 'Green', 'Blue', 'Orange']

  beforeEach(() => {
    cy.visit('/useTagGroup')

    // Ensure the listbox exists
    cy.findByRole('listbox', {name: /colors example/i}).should('exist')

    // Ensure it has 5 color tags
    cy.findAllByRole('option').should('have.length', 5)
  })

  it('clicks a tag and navigates with circular arrow keys', () => {
    // Click first tag ("Black")
    cy.findByRole('option', {name: /Black/i}).click().should('have.focus')

    // Arrow Right navigation through all tags
    for (let index = 0; index < colors.length; index++) {
      const nextIndex = (index + 1) % colors.length
      cy.focused().trigger('keydown', {key: 'ArrowRight'})
      cy.findByRole('option', {name: colors[nextIndex]}).should('have.focus')
    }

    // Arrow Left navigation through all tags (circular)
    for (let index = colors.length - 1; index >= 0; index--) {
      const prevIndex = (index + colors.length) % colors.length
      cy.focused().trigger('keydown', {key: 'ArrowLeft'})
      cy.findByRole('option', {name: colors[prevIndex]}).should('have.focus')
    }

    // Circular on the left.
    cy.focused().trigger('keydown', {key: 'ArrowLeft'})
    cy.findByRole('option', {name: colors[colors.length - 1]}).should(
      'have.focus',
    )
  })

  it('deletes a tag using Delete and Backspace', () => {
    // Focus "Red"
    cy.findByRole('option', {name: /Red/i}).click()

    // Delete key
    cy.focused().trigger('keydown', {key: 'Delete'})
    cy.findAllByRole('option').should('have.length', 4)

    // Next tag should be "Green"
    cy.focused().should('contain.text', 'Green')

    // Backspace key removes "Green"
    cy.focused().trigger('keydown', {key: 'Backspace'})
    cy.findAllByRole('option').should('have.length', 3)

    // Focus should now be on "Blue"
    cy.focused().should('contain.text', 'Blue')
  })

  it('removes a tag via remove button', () => {
    // Remove "Blue" via its remove button
    cy.findByRole('option', {name: /Blue/i}).within(() => {
      cy.findByRole('button', {name: /remove/i}).click()
    })

    // Verify 4 tags remain
    cy.findAllByRole('option').should('have.length', 4)

    // Orange tag should have focus.
    cy.findByRole('option', {name: /Orange/i}).should('have.focus')
  })

  it('adds a tag from the list', () => {
    // Focus "Red"
    cy.findByRole('option', {name: /Red/i}).click()

    // Clicks the Lime option from the add tags list.
    cy.findByRole('button', {name: /Lime/i}).click()

    // Verify 6 tags are visible
    cy.findAllByRole('option').should('have.length', 6)

    cy.findByRole('option', {name: /Lime/i}).should('be.visible')
    // Including the new option
  })
})
