// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Editing Items', () => {
  test('Edit Item Title', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // 2. Click the "Edit" button on the first item
    const firstRow = page.locator('tbody tr').first();
    await firstRow.getByRole('button', { name: 'Edit' }).click();

    // Verify modal opens with title "Edit Item" and pre-filled data
    await expect(page.getByRole('heading', { name: 'Edit Item' })).toBeVisible();
    await expect(page.getByLabel('Title')).toHaveValue('Learn Vite 8.0');

    // 3. Change the Title to "Updated Title"
    await page.getByLabel('Title').clear();
    await page.getByLabel('Title').fill('Updated Title');

    // 4. Click "Save Changes" button
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify modal closes
    await expect(page.getByRole('heading', { name: 'Edit Item' })).not.toBeVisible();

    // Verify updated title is visible in the table
    await expect(page.getByText('Updated Title')).toBeVisible();

    // Verify old title is no longer visible
    await expect(page.getByText('Learn Vite 8.0')).not.toBeVisible();
  });
});
