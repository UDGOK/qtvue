import { test, expect } from '@playwright/test'

test('home loads and shows hero heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('primary nav routes resolve without 404', async ({ page }) => {
  for (const path of [
    '/services',
    '/industries',
    '/work',
    '/about',
    '/blog',
    '/careers',
    '/contact',
  ]) {
    await page.goto(path)
    await expect(page).not.toHaveTitle(/404/i)
  }
})

test('contact form shows validation errors on empty submit', async ({ page }) => {
  await page.goto('/contact')
  // Wait for client hydration to finish before interacting (otherwise the
  // @submit handler isn't bound yet and the form does a native submit).
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /send message/i }).click()
  await expect(page.getByText(/please enter your name/i)).toBeVisible()
})

test('language switcher is hidden (single locale)', async ({ page }) => {
  await page.goto('/')
  // Switcher renders nothing when only one locale is configured.
  await expect(page.locator('[data-i18n-switcher]')).toHaveCount(0)
})

test('theme toggle switches the dark class on <html>', async ({ page }) => {
  // Force a deterministic starting state (light) so the assertion is stable.
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light')
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // In light mode there's no 'dark' class; after clicking it should appear.
  await page.getByRole('button', { name: /switch to dark mode/i }).click()
  await expect(page.locator('html')).toHaveClass(/\bdark\b/)
})

test('case study detail renders its heading', async ({ page }) => {
  await page.goto('/work/sample-welding-cell')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('unknown route shows the branded 404', async ({ page }) => {
  await page.goto('/this-does-not-exist')
  await expect(page.getByText('404')).toBeVisible()
})
