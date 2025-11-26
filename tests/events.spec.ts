import { test, expect } from '@playwright/test'

test.describe('Events', () => {
  test('should show event details page', async ({ page }) => {
    // This test assumes there's at least one event in the database
    // In a real scenario, you'd seed the database with test data
    
    await page.goto('/')
    
    // Check if there are any events displayed
    const eventCards = page.locator('[href^="/event/"]')
    const count = await eventCards.count()
    
    if (count > 0) {
      // Click the first event
      await eventCards.first().click()
      
      // Should be on event details page
      await expect(page).toHaveURL(/\/event\//)
      await expect(page.locator('h1')).toBeVisible()
      
      // Check for event details sections
      await expect(page.getByText(/Event Details/i)).toBeVisible()
      await expect(page.getByText(/What to Expect/i)).toBeVisible()
      
      // Check for registration button
      const registerButton = page.getByRole('link', { name: /Register Now/i })
      if (await registerButton.isVisible()) {
        await expect(registerButton).toBeEnabled()
      }
    }
  })
})

test.describe('Registration', () => {
  test('should show registration form', async ({ page }) => {
    // This test assumes there's at least one event in the database
    
    await page.goto('/')
    
    const eventCards = page.locator('[href^="/event/"]')
    const count = await eventCards.count()
    
    if (count > 0) {
      await eventCards.first().click()
      
      const registerButton = page.getByRole('link', { name: /Register Now/i })
      if (await registerButton.isVisible()) {
        await registerButton.click()
        
        // Should be on registration page
        await expect(page).toHaveURL(/\/register\//)
        await expect(page.getByText(/Event Registration/i)).toBeVisible()
        
        // Check form fields
        await expect(page.getByLabel(/Full Name/i)).toBeVisible()
        await expect(page.getByLabel(/Email Address/i)).toBeVisible()
        await expect(page.getByLabel(/Phone Number/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /Complete Registration/i })).toBeVisible()
      }
    }
  })

  test('should validate registration form', async ({ page }) => {
    await page.goto('/')
    
    const eventCards = page.locator('[href^="/event/"]')
    const count = await eventCards.count()
    
    if (count > 0) {
      await eventCards.first().click()
      
      const registerButton = page.getByRole('link', { name: /Register Now/i })
      if (await registerButton.isVisible()) {
        await registerButton.click()
        
        // Try to submit without filling form
        await page.getByRole('button', { name: /Complete Registration/i }).click()
        
        // Form should show validation errors (HTML5 validation)
        const nameInput = page.getByLabel(/Full Name/i)
        await expect(nameInput).toBeFocused()
      }
    }
  })
})

