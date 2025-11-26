import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.locator('h1')).toContainText('Admin Login')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should redirect to admin after login', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD

    // Skip if no test credentials
    if (!adminEmail || !adminPassword) {
      test.skip()
      return
    }

    await page.goto('/login')
    
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Password').fill(adminPassword)
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
  })

  test('should protect admin routes', async ({ page }) => {
    // Try to access admin without logging in
    await page.goto('/admin')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})

