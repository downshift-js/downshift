import {test, expect} from '@playwright/test'

// The combobox happens to be in the center of the page.
// Without specifying coordinates for body events we would fire on the combobox.
const bodyX = 100
const bodyY = 500

test.describe('combobox', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/combobox')
    await page.getByTestId('clear-button').click()
  })

  test('can select an item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.pressSequentially('ee')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Green')
  })

  test('can arrow up to select last item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowUp')
    await input.press('Enter')
    await expect(input).toHaveValue('Skyblue')
  })

  test('can arrow down to select first item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Black')
  })

  test('can down arrow to select an item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowDown')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Red')
  })

  test('can use home arrow to select first item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowDown')
    await input.press('ArrowDown')
    await input.press('Home')
    await input.press('Enter')
    await expect(input).toHaveValue('Black')
  })

  test('can use end arrow to select last item', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowDown')
    await input.press('End')
    await input.press('Enter')
    await expect(input).toHaveValue('Skyblue')
  })

  test('resets the item on blur', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.press('ArrowDown')
    await input.press('Enter')
    await expect(input).toHaveValue('Black')
    await page.mouse.click(bodyX, bodyY)
    await expect(input).toHaveValue('Black')
  })

  test('can use the mouse to click an item', async ({page}) => {
    await page.getByTestId('combobox-input').fill('red')
    await page.getByTestId('downshift-item-0').click()
    await expect(page.getByTestId('combobox-input')).toHaveValue('Red')
  })

  test('does not reset the input when mouseup outside while the input is focused', async ({
    page,
  }) => {
    const input = page.getByTestId('combobox-input')
    await input.fill('red')
    await page.getByTestId('downshift-item-0').click()
    await expect(input).toHaveValue('Red')

    await input.press('Backspace')
    await input.press('Backspace')
    await expect(input).toHaveValue('R')

    await input.click()
    await page.evaluate(
      ({x, y}) => {
        window.dispatchEvent(
          new MouseEvent('mouseup', {clientX: x, clientY: y, bubbles: true}),
        )
      },
      {x: bodyX, y: bodyY},
    )
    await expect(input).toHaveValue('R')

    await input.blur()
    await page.mouse.click(bodyX, bodyY)
    await expect(input).toHaveValue('Red')
  })

  test('resets when blurring the input', async ({page}) => {
    const input = page.getByTestId('combobox-input')
    await input.fill('re')
    await input.blur()
    await expect(page.getByTestId('downshift-item-0')).not.toBeVisible()
  })

  test('does not reset when tabbing from input to the toggle button', async ({
    page,
  }) => {
    await page.getByTestId('combobox-input').fill('pu')
    await page.getByTestId('combobox-toggle-button').focus()
    await page.getByTestId('downshift-item-0').click()
    await expect(page.getByTestId('combobox-input')).toHaveValue('Purple')
  })

  test('does not reset when tabbing from the toggle button to the input', async ({
    page,
  }) => {
    await page.getByTestId('combobox-toggle-button').click()
    await page.getByTestId('combobox-input').focus()
    await page.getByTestId('downshift-item-0').click()
    await expect(page.getByTestId('combobox-input')).toHaveValue('Black')
  })

  test('resets when tapping outside on a touch screen', async ({page}) => {
    await page.getByTestId('combobox-input').fill('re')
    await page.touchscreen.tap(bodyX, bodyY)
    await expect(page.getByTestId('downshift-item-0')).not.toBeVisible()
  })

  test('does not reset when swiping outside to scroll a touch screen', async ({
    page,
  }) => {
    await page.getByTestId('combobox-input').fill('re')
    await page.evaluate(
      ({x, y, dy}) => {
        const makeTouch = (cx: number, cy: number) =>
          new Touch({
            identifier: 1,
            target: document.body,
            clientX: cx,
            clientY: cy,
          })
        const dispatch = (type: string, cx: number, cy: number) => {
          const touch = makeTouch(cx, cy)
          document.body.dispatchEvent(
            new TouchEvent(type, {
              touches: [touch],
              changedTouches: [touch],
              bubbles: true,
            }),
          )
        }
        dispatch('touchstart', x, y)
        dispatch('touchmove', x, y + dy)
        dispatch('touchend', x, y + dy)
      },
      {x: bodyX, y: bodyY, dy: 20},
    )
    await expect(page.getByTestId('downshift-item-0')).toBeVisible()
  })
})
