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

for (const [locale, label] of [
  ['en', 'Download my CV'],
  ['es', 'Descargar mi CV']
] as const) {
  test(`downloads the ${locale} CV on every click`, async ({ page }) => {
    await page.goto(`/${locale}`)

    const downloadLink = page.getByRole('link', { name: label })

    const downloadAndAssert = async () => {
      const downloadPromise = page.waitForEvent('download')
      await downloadLink.click()

      const download = await downloadPromise
      expect(download.suggestedFilename()).toBe(`Pablo-Pineda-CV-${locale}.pdf`)
    }

    const download = async (attempts: number): Promise<void> => {
      if (attempts === 0) return

      await downloadAndAssert()
      await download(attempts - 1)
    }

    await download(2)
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
  if (initialTheme === null) throw new Error('Initial theme attribute was not set')
  const themeSwitch = page.getByRole('switch')

  await expect(themeSwitch).toHaveAttribute('aria-checked', initialTheme)
  await themeSwitch.click()

  await expect.poll(() => body.getAttribute('dark')).not.toBe(initialTheme)
  const selectedTheme = await body.getAttribute('dark')
  if (selectedTheme === null) throw new Error('Theme attribute was not set')
  await expect(themeSwitch).toHaveAttribute('aria-checked', selectedTheme)

  await page.reload()
  await expect(body).toHaveAttribute('dark', selectedTheme)
})

for (const [locale, label] of [
  ['en', 'Go to top'],
  ['es', 'Ir hacia arriba']
] as const) {
  test(`scrolls to the top from the ${locale} go-to-top button`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

    await page.getByRole('link', { name: label }).click()

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(page).toHaveURL(new RegExp(`/${locale}$`))
  })
}

test('opens and closes the image showcase accessibly', async ({ page }) => {
  await page.goto('/en')

  await page.getByTitle('Expand').first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})

test('navigates sections with number keys without interrupting form input', async ({
  page
}) => {
  await page.goto('/en')

  await page.keyboard.press('6')
  await expect
    .poll(() =>
      page.locator('#contact').evaluate((element) => {
        const { top } = element.getBoundingClientRect()
        return top >= 0 && top < window.innerHeight / 2
      })
    )
    .toBe(true)

  const nameInput = page.getByLabel('Name')
  await nameInput.focus()
  await page.keyboard.press('1')

  await expect(nameInput).toHaveValue('1')
  await expect(page).toHaveURL(/#contact$/)
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

  test('closes from the close button and the modal backdrop', async ({ page }) => {
    await page.goto('/en')

    const trigger = page.getByRole('button', { name: 'Navigate to' })
    const dialog = page.getByRole('dialog', { name: 'Navigate to' })

    await trigger.click()
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).not.toBeVisible()

    await trigger.click()
    await expect(dialog).toBeVisible()

    await page.mouse.click(8, 8)
    await expect(dialog).not.toBeVisible()
  })
})
