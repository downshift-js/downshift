import {test, expect} from '@playwright/test'

test.describe('useMultipleCombobox', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/useMultipleCombobox')
  })

  test('can select multiple items', async ({page}) => {
    await page.getByRole('button', {name: 'toggle menu'}).click()
    await page.getByRole('option', {name: 'Green'}).click()
    await page.getByRole('option', {name: 'Gray'}).click()
    await page.getByRole('button', {name: 'toggle menu'}).click()

    await expect(page.getByText('Black')).toBeVisible()
    await expect(page.getByText('Red')).toBeVisible()
    await expect(page.getByText('Green')).toBeVisible()
    await expect(page.getByText('Gray')).toBeVisible()
  })
})
