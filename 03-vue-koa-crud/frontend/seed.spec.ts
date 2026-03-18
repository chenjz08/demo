import { test, expect } from '@playwright/test';

test.describe('CRUD Application', () => {
  test('seed', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Verify the app loads with the main heading
    await expect(page.getByRole('heading', { name: 'Project Dashboard' })).toBeVisible();

    // Verify the "Add New Item" button is visible
    await expect(page.getByRole('button', { name: 'Add New Item' })).toBeVisible();

    // Verify the initial items table is loaded (wait for API response)
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });
  });
});
