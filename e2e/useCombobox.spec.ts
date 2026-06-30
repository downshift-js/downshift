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

  test('can select an item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.pressSequentially('aq')
    await expect(input).toHaveValue('aq')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Aqua')
  })
})

test.describe('useCombobox (Compiled)', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/useCombobox_compiled')
  })

  test('should keep focus on the input when selecting by click', async ({
    page,
  }) => {
    await page.getByTestId('combobox-toggle-button').click()
    await page.getByTestId('downshift-item-0').click()
    await expect(page.getByTestId('combobox-input')).toBeFocused()
  })

  test('can select an item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.pressSequentially('aq')
    await expect(input).toHaveValue('aq')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Aqua')
  })
})
