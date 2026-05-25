import {test, expect} from '@playwright/test'

test.describe('useTagGroup', () => {
  const colors = ['Black', 'Red', 'Green', 'Blue', 'Orange']

  test.beforeEach(async ({page}) => {
    await page.goto('/useTagGroup')
    await expect(page.getByRole('listbox', {name: /colors example/i})).toBeVisible()
    await expect(page.getByRole('option')).toHaveCount(5)
  })

  test('clicks a tag and navigates with circular arrow keys', async ({page}) => {
    await page.getByRole('option', {name: /Black/i}).click()
    await expect(page.getByRole('option', {name: /Black/i})).toBeFocused()

    // Arrow Right navigation through all tags
    // eslint-disable-next-line no-await-in-loop
    for (let index = 0; index < colors.length; index++) {
      const nextIndex = (index + 1) % colors.length
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('ArrowRight')
      // eslint-disable-next-line no-await-in-loop
      await expect(
        page.getByRole('option', {name: colors[nextIndex]}),
      ).toBeFocused()
    }

    // Arrow Left navigation through all tags (circular)
    // eslint-disable-next-line no-await-in-loop
    for (let index = colors.length - 1; index >= 0; index--) {
      const prevIndex = (index + colors.length) % colors.length
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('ArrowLeft')
      // eslint-disable-next-line no-await-in-loop
      await expect(
        page.getByRole('option', {name: colors[prevIndex]}),
      ).toBeFocused()
    }

    // Circular on the left
    await page.keyboard.press('ArrowLeft')
    await expect(
      page.getByRole('option', {name: colors[colors.length - 1]}),
    ).toBeFocused()
  })

  test('deletes a tag using Delete and Backspace', async ({page}) => {
    await page.getByRole('option', {name: /Red/i}).click()

    await page.keyboard.press('Delete')
    await expect(page.getByRole('option')).toHaveCount(4)
    await expect(page.getByRole('option', {name: /Green/i})).toBeFocused()

    await page.keyboard.press('Backspace')
    await expect(page.getByRole('option')).toHaveCount(3)
    await expect(page.getByRole('option', {name: /Blue/i})).toBeFocused()
  })

  test('removes a tag via remove button', async ({page}) => {
    const blueOption = page.getByRole('option', {name: /Blue/i})
    await blueOption.getByRole('button', {name: /remove/i}).click()

    await expect(page.getByRole('option')).toHaveCount(4)
    await expect(page.getByRole('option', {name: /Orange/i})).toBeFocused()
  })

  test('adds a tag from the list', async ({page}) => {
    await page.getByRole('option', {name: /Red/i}).click()
    await page.getByRole('button', {name: /Lime/i}).click()

    await expect(page.getByRole('option')).toHaveCount(6)
    await expect(page.getByRole('option', {name: /Lime/i})).toBeVisible()
  })
})
