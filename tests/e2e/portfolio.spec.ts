import { expect, test } from '@playwright/test'

test('renders both localized portfolio routes', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Portfolio/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pablo Pineda')
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()

  await page.goto('/es')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pablo Pineda')
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible()
})

test('switches locale and preserves client navigation', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('link', { name: 'en', exact: true }).click()

  await expect(page).toHaveURL(/\/es$/)
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible()
})

test('toggles and persists the selected theme', async ({ page }) => {
  await page.goto('/en')

  const body = page.locator('body')
  await expect(body).toHaveAttribute('dark', /^(true|false)$/)
  const initialTheme = await body.getAttribute('dark')

  await page.getByTitle('Toggle dark theme').click()

  await expect.poll(() => body.getAttribute('dark')).not.toBe(initialTheme)
  const selectedTheme = await body.getAttribute('dark')
  if (selectedTheme === null) throw new Error('Theme attribute was not set')

  await page.reload()
  await expect(body).toHaveAttribute('dark', selectedTheme)
})

test('opens and closes the image showcase accessibly', async ({ page }) => {
  await page.goto('/en')

  await page.getByTitle('Expand').first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})
