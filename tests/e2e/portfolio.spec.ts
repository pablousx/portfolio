import { expect, test } from '@playwright/test'

const siteUrl = (process.env.SITE_URL ?? 'https://pablo.steralynx.com').replace(
  /\/+$/,
  ''
)

test('renders both localized portfolio routes', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Full-Stack Product Engineer/)
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
  ['en', 'Download PDF'],
  ['es', 'Descargar PDF']
] as const) {
  test(`downloads the ${locale} CV from the HTML resume`, async ({ page }) => {
    await page.goto(`/${locale}/resume`)

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

for (const [locale, profileLabel, title] of [
  ['en', 'Profile', 'Full-Stack Product Engineer & Tech Lead'],
  ['es', 'Perfil', 'Ingeniero de Producto Full-Stack y Tech Lead']
] as const) {
  test(`renders the crawlable ${locale} resume`, async ({ page }) => {
    await page.goto(`/${locale}/resume`)

    await expect(page).toHaveTitle(new RegExp(title))
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pablo Pineda')
    await expect(page.getByRole('heading', { name: profileLabel })).toBeVisible()
    await expect(page.getByText(/four years|cuatro años/).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /PDF/ })).toHaveAttribute(
      'href',
      `/${locale}/cv`
    )
  })
}

test('redirects the root URL to the default English profile', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/en$/)
})

for (const [locale, expectedTitle] of [
  ['en', 'Pablo Pineda | Full-Stack Product Engineer & Tech Lead'],
  ['es', 'Pablo Pineda | Ingeniero de Producto Full-Stack y Tech Lead']
] as const) {
  test(`publishes complete ${locale} search metadata`, async ({ page }) => {
    await page.goto(`/${locale}`)

    await expect(page).toHaveTitle(expectedTitle)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${siteUrl}/${locale}`
    )
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${siteUrl}/en`
    )
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      `${siteUrl}/es`
    )
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]')
    ).toHaveAttribute('href', `${siteUrl}/en`)

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent()
    expect(jsonLd).not.toBeNull()
    const graph = JSON.parse(jsonLd ?? '{}')['@graph'] as Record<string, unknown>[]
    const person = graph.find((item) => item['@type'] === 'Person')
    expect(person).toMatchObject({
      name: 'Pablo Pineda',
      jobTitle: ['Full-Stack Product Engineer', 'Tech Lead']
    })
  })
}

test('exposes crawl controls and AI-readable discovery files', async ({ request }) => {
  const [robotsResponse, sitemapResponse, llmsResponse] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
    request.get('/llms.txt')
  ])

  await expect(robotsResponse).toBeOK()
  await expect(sitemapResponse).toBeOK()
  await expect(llmsResponse).toBeOK()

  const robots = await robotsResponse.text()
  expect(robots).toContain('User-Agent: *')
  expect(robots).toContain('Allow: /')
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`)

  const sitemap = await sitemapResponse.text()
  expect(sitemap).toContain(`${siteUrl}/en`)
  expect(sitemap).toContain(`${siteUrl}/es`)
  expect(sitemap).toContain(`${siteUrl}/en/resume`)
  expect(sitemap).toContain('hreflang="x-default"')
  expect(sitemap).not.toContain('quiz.pablousx.vercel.app')

  const llms = await llmsResponse.text()
  expect(llms).toContain('Full-Stack Product Engineer')
  expect(llms).toContain(`${siteUrl}/en/cv`)
})

test('switches locale and preserves client navigation', async ({ page }) => {
  await page.goto('/en')

  const localeLink = page.getByRole('link', { name: 'en', exact: true })
  const localeHint = localeLink.locator('..')

  await localeLink.hover()
  await expect
    .poll(() => localeHint.evaluate((hint) => getComputedStyle(hint, '::after').opacity))
    .toBe('1')

  await localeLink.evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once: true })
  })
  await localeLink.click()
  await expect(localeHint).toHaveClass(/hide/)
  await expect(localeHint).not.toHaveClass(/hint--always/)

  await page.mouse.move(0, 0)
  await expect(localeHint).not.toHaveClass(/hide/, { timeout: 500 })
  await localeLink.hover()
  await expect
    .poll(() => localeHint.evaluate((hint) => getComputedStyle(hint, '::after').opacity))
    .toBe('1')

  await localeLink.click()

  await expect(page).toHaveURL(/\/es$/)
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible()
  await page.mouse.move(0, 0)
  const switchedLocaleHint = page
    .getByRole('link', { name: 'es', exact: true })
    .locator('..')
  await expect(switchedLocaleHint).not.toHaveClass(/hint--always/)
  await expect
    .poll(() =>
      switchedLocaleHint.evaluate((hint) => getComputedStyle(hint, '::after').opacity)
    )
    .toBe('0')

  const switchedLocaleLink = page.getByRole('link', { name: 'es', exact: true })
  await switchedLocaleLink.hover()
  await expect
    .poll(() =>
      switchedLocaleHint.evaluate((hint) => getComputedStyle(hint, '::after').opacity)
    )
    .toBe('1')
})

test('keeps the CV action width and contact spacing consistent across locales', async ({
  page
}) => {
  const getActionLayout = (label: string) =>
    page.getByRole('link', { name: label }).evaluate((action) => {
      const contact = action.nextElementSibling
      const firstIcon = contact?.firstElementChild
      if (!(contact instanceof HTMLElement) || !(firstIcon instanceof HTMLElement)) {
        return null
      }

      const actionRect = action.getBoundingClientRect()
      const iconRect = action.querySelector('figure')?.getBoundingClientRect()
      const contactRect = contact.getBoundingClientRect()
      const firstIconRect = firstIcon.getBoundingClientRect()
      const borderWidth = Number.parseFloat(getComputedStyle(contact).borderLeftWidth)

      return {
        width: Math.round(actionRect.width),
        iconWidth: Math.round(iconRect?.width ?? 0),
        beforeSeparator: Math.round(contactRect.left - actionRect.right),
        afterSeparator: Math.round(firstIconRect.left - contactRect.left - borderWidth)
      }
    })

  await page.goto('/en')
  const englishAction = page.getByRole('link', { name: 'Download my CV' })
  await expect(englishAction).toHaveAttribute('href', '/en/cv')
  await expect(englishAction).toHaveAttribute('download', '')
  await expect
    .poll(() => getActionLayout('Download my CV'))
    .toEqual({
      width: 240,
      iconWidth: 24,
      beforeSeparator: 28,
      afterSeparator: 28
    })

  await page.getByRole('link', { name: 'en', exact: true }).click()
  await expect(page).toHaveURL(/\/es$/)
  const spanishAction = page.getByRole('link', { name: 'Descargar mi CV' })
  await expect(spanishAction).toHaveAttribute('href', '/es/cv')
  await expect(spanishAction).toHaveAttribute('download', '')
  await expect
    .poll(() => getActionLayout('Descargar mi CV'))
    .toEqual({
      width: 240,
      iconWidth: 24,
      beforeSeparator: 28,
      afterSeparator: 28
    })
})

test('preserves form state across locale navigation', async ({ page }) => {
  await page.goto('/en')

  const draftName = 'Cache Components draft'
  await page.getByLabel('Name').fill(draftName)

  await page.getByRole('link', { name: 'Go to top' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  await page.getByRole('link', { name: 'en', exact: true }).click()
  await expect(page).toHaveURL(/\/es$/)

  await page.evaluate(() => localStorage.removeItem('contact-form:v1'))

  await page.getByRole('link', { name: 'es', exact: true }).click()
  await expect(page).toHaveURL(/\/en$/)

  await expect(page.getByLabel('Name')).toHaveValue(draftName)
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

  await expect(page.locator('body')).toHaveAttribute('dark', /^(true|false)$/)

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

test('keeps the interactive overlay aligned after switching locale', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('heading', { name: 'Experience' }).scrollIntoViewIfNeeded()

  const getMisalignedElementCount = () =>
    page.evaluate(() => {
      const main = document.querySelector('main')
      const layout = document.getElementById('layout')
      if (!main || !layout) return -1

      const selector = [
        '.interactive-layout',
        '.interactive-aura',
        '.interactive-border',
        'h2',
        'strong',
        '.interactive-text',
        '.interactive-icon'
      ].join(',')
      const sourceElements = Array.from(main.querySelectorAll<HTMLElement>(selector))
      const overlayElements = layout.querySelectorAll('[data-interactive-index]')
      if (sourceElements.length !== overlayElements.length) return -1

      return sourceElements.reduce((misalignedCount, source, index) => {
        const overlay = layout.querySelector<HTMLElement>(
          `[data-interactive-index="${index}"]`
        )
        if (!overlay) return misalignedCount + 1

        const sourceRect = source.getBoundingClientRect()
        const overlayRect = overlay.getBoundingClientRect()
        const isMisaligned =
          Math.abs(sourceRect.top - overlayRect.top) >= 1 ||
          Math.abs(sourceRect.left - overlayRect.left) >= 1

        return misalignedCount + Number(isMisaligned)
      }, 0)
    })

  const switchLocale = async (
    currentLocale: 'en' | 'es',
    nextLocale: 'en' | 'es',
    heading: 'Experience' | 'Experiencia'
  ) => {
    await page.getByRole('link', { name: currentLocale, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/${nextLocale}$`))
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    await expect.poll(getMisalignedElementCount).toBe(0)
  }

  await switchLocale('en', 'es', 'Experiencia')
  await switchLocale('es', 'en', 'Experience')
  await switchLocale('en', 'es', 'Experiencia')

  await page.setViewportSize({ width: 1024, height: 700 })
  await expect.poll(getMisalignedElementCount).toBe(0)
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
