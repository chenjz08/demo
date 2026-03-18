// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Adding New Items', () => {
  test('Add Item with Title Only', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // 2. Click the "Add New Item" button
    await page.getByRole('button', { name: 'Add New Item' }).click();

    // 3. Fill in Title with "Title Only Item"
    await page.getByLabel('Title').fill('Title Only Item');

    // 4. Leave Description empty (default)
    // 5. Keep Status as default (Active)

    // 6. Click "Create Item" button
    await page.getByRole('button', { name: 'Create Item' }).click();

    // Verify modal closes after submission
    await expect(page.getByRole('heading', { name: 'Create New Item' })).not.toBeVisible();

    // Verify new item "Title Only Item" appears in the table
    await expect(page.getByText('Title Only Item')).toBeVisible();
  });
});
