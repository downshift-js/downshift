import {test, expect} from '@playwright/test'

test.describe('useCombobox', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/useCombobox')
  })

  test('should keep focus on the input when selecting by click', async ({
    page,
  }) => {
    await page.getByTestId('combobox-toggle-button').click()
    await page.getByTestId('downshift-item-0').click()
    await expect(page.getByTestId('combobox-input')).toBeFocused()
  })
})
