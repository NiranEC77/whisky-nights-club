import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Whisky Nights Club')
    
    // Check for navigation
    await expect(page.locator('header')).toBeVisible()
    
    // Check for features section
    await expect(page.getByText('Regular Events')).toBeVisible()
    await expect(page.getByText('Intimate Gatherings')).toBeVisible()
    await expect(page.getByText('Expert Guidance')).toBeVisible()
  })

  test('should display upcoming events section', async ({ page }) => {
    await page.goto('/')
    
    // Check for events section
    await expect(page.getByText('Upcoming Events')).toBeVisible()
  })

  test('should have login link in header', async ({ page }) => {
    await page.goto('/')
    
    // Check for admin login button
    await expect(page.getByRole('link', { name: /admin login/i })).toBeVisible()
  })
})

