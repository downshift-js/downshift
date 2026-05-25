import {test, expect} from '@playwright/test'

test.describe('useSelect', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/useSelect')
  })

  test('can open and close a menu', async ({page}) => {
    const toggle = page.getByRole('combobox')
    const options = page.getByRole('option')

    await toggle.click()
    await expect(options).not.toHaveCount(0)

    await toggle.click()
    await expect(options).toHaveCount(0)

    await toggle.click()
    await expect(options).not.toHaveCount(0)
  })
})
