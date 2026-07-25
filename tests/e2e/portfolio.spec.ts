import { expect, test } from '@playwright/test'

test('renders both localized portfolio routes', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Portfolio/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pablo Pineda')
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Credentials' })).toBeVisible()

  await page.goto('/es')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pablo Pineda')
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Credenciales' })).toBeVisible()
})

for (const locale of ['en', 'es']) {
  test(`generates the ${locale} CV as a PDF`, async ({ request }) => {
    const response = await request.get(`/${locale}/cv`)

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    expect(response.headers()['content-disposition']).toContain(
      `Pablo-Pineda-CV-${locale}.pdf`
    )

    const body = await response.body()
    expect(body.byteLength).toBeGreaterThan(5_000)
    expect(body.subarray(0, 4).toString()).toBe('%PDF')
  })
}

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

test('keeps the interactive overlay aligned after a viewport resize', async ({
  page
}) => {
  await page.goto('/en')

  await expect
    .poll(() =>
      page.evaluate(() => {
        const source = Array.from(document.querySelectorAll('main h2')).find(
          (element) => element.textContent === 'Projects'
        )
        const overlay = Array.from(document.querySelectorAll('#layout h2')).find(
          (element) => element.textContent === 'Projects'
        )
        if (!source || !overlay) return false

        return (
          Math.abs(
            source.getBoundingClientRect().top - overlay.getBoundingClientRect().top
          ) < 1
        )
      })
    )
    .toBe(true)

  await page.setViewportSize({ width: 1024, height: 700 })

  await expect
    .poll(() =>
      page.evaluate(() => {
        const source = Array.from(document.querySelectorAll('main h2')).find(
          (element) => element.textContent === 'Projects'
        )
        const overlay = Array.from(document.querySelectorAll('#layout h2')).find(
          (element) => element.textContent === 'Projects'
        )
        if (!source || !overlay) return false

        return (
          Math.abs(
            source.getBoundingClientRect().top - overlay.getBoundingClientRect().top
          ) < 1
        )
      })
    )
    .toBe(true)
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 500, height: 800 } })

  test('opens as a modal dialog and restores focus when closed', async ({ page }) => {
    await page.goto('/en')

    const trigger = page.getByRole('button', { name: 'Navigate to' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'Navigate to' })
    await expect(dialog).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('body')).toHaveClass(/navbar-menu-open/)

    await page.keyboard.press('Escape')

    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveClass(/navbar-menu-open/)
  })
})
