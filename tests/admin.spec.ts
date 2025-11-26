import { test, expect } from '@playwright/test'

// Helper to login as admin
async function loginAsAdmin(page: any) {
  const adminEmail = process.env.TEST_ADMIN_EMAIL
  const adminPassword = process.env.TEST_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    test.skip()
    return false
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(adminEmail)
  await page.getByLabel('Password').fill(adminPassword)
  await page.getByRole('button', { name: /sign in/i }).click()
  
  return true
}

test.describe('Admin Dashboard', () => {
  test('should show admin dashboard after login', async ({ page }) => {
    const loggedIn = await loginAsAdmin(page)
    if (!loggedIn) return

    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
    
    // Check for stats cards
    await expect(page.getByText(/Total Events/i)).toBeVisible()
    await expect(page.getByText(/Total Registrations/i)).toBeVisible()
    await expect(page.getByText(/Total Revenue/i)).toBeVisible()
    
    // Check for create event button
    await expect(page.getByRole('link', { name: /Create Event/i })).toBeVisible()
  })

  test('should navigate to create event page', async ({ page }) => {
    const loggedIn = await loginAsAdmin(page)
    if (!loggedIn) return

    await page.getByRole('link', { name: /Create Event/i }).first().click()
    
    await expect(page).toHaveURL(/\/admin\/events\/new/)
    await expect(page.locator('h1')).toContainText('Create New Event')
    
    // Check for form fields
    await expect(page.getByLabel(/Event Title/i)).toBeVisible()
    await expect(page.getByLabel(/Description/i)).toBeVisible()
    await expect(page.getByLabel(/Event Date/i)).toBeVisible()
    await expect(page.getByLabel(/Start Time/i)).toBeVisible()
    await expect(page.getByLabel(/Price per Person/i)).toBeVisible()
    await expect(page.getByLabel(/Maximum Seats/i)).toBeVisible()
  })

  test('should validate event creation form', async ({ page }) => {
    const loggedIn = await loginAsAdmin(page)
    if (!loggedIn) return

    await page.goto('/admin/events/new')
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /Create Event/i }).click()
    
    // Form should show validation (HTML5)
    const titleInput = page.getByLabel(/Event Title/i)
    await expect(titleInput).toBeFocused()
  })
})

test.describe('Event Management', () => {
  test('should show event list on admin dashboard', async ({ page }) => {
    const loggedIn = await loginAsAdmin(page)
    if (!loggedIn) return

    await expect(page.getByText(/All Events/i)).toBeVisible()
    
    // Check if there are manage/edit buttons for events
    const manageButtons = page.getByRole('link', { name: /Manage/i })
    const count = await manageButtons.count()
    
    if (count > 0) {
      await expect(manageButtons.first()).toBeVisible()
    }
  })

  test('should navigate to manage event page', async ({ page }) => {
    const loggedIn = await loginAsAdmin(page)
    if (!loggedIn) return

    const manageButtons = page.getByRole('link', { name: /Manage/i })
    const count = await manageButtons.count()
    
    if (count > 0) {
      await manageButtons.first().click()
      
      // Should be on event management page
      await expect(page).toHaveURL(/\/admin\/events\/[^/]+$/)
      await expect(page.getByText(/Attendee List/i)).toBeVisible()
      
      // Check for stats
      await expect(page.getByText(/Total Registrations/i)).toBeVisible()
      await expect(page.getByText(/Paid/i)).toBeVisible()
      await expect(page.getByText(/Pending Payment/i)).toBeVisible()
    }
  })
})

