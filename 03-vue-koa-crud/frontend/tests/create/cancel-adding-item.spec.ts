// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Adding New Items', () => {
  test('Cancel Adding Item', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // Note the current number of items
    const initialRows = await page.locator('tbody tr').count();

    // 2. Click the "Add New Item" button
    await page.getByRole('button', { name: 'Add New Item' }).click();

    // 3. Fill in Title with "Should Not Be Created"
    await page.getByLabel('Title').fill('Should Not Be Created');

    // 4. Click "Cancel" button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify modal closes
    await expect(page.getByRole('heading', { name: 'Create New Item' })).not.toBeVisible();

    // Verify no new item "Should Not Be Created" appears in the table
    await expect(page.getByText('Should Not Be Created')).not.toBeVisible();

    // Verify item count remains unchanged
    await expect(page.locator('tbody tr')).toHaveCount(initialRows);
  });
});
