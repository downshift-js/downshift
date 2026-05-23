import {test, expect} from '@playwright/test'

test.describe('useMultipleSelect', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/useMultipleSelect')
  })

  test('can select multiple options', async ({page}) => {
    await page.getByRole('combobox').click()
    await page.getByRole('option', {name: 'Green'}).click()
    await page.getByRole('option', {name: 'Blue', exact: true}).click()
    await page.getByRole('combobox').click()

    await expect(page.getByText('Black')).toBeVisible()
    await expect(page.getByText('Red')).toBeVisible()
    await expect(page.getByText('Green')).toBeVisible()
    await expect(page.getByText('Blue')).toBeVisible()
  })
})
