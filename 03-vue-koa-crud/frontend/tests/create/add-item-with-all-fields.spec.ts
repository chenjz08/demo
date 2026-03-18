// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Adding New Items', () => {
  test('Add Item with All Fields', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Project Dashboard' })).toBeVisible();
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // 2. Click the "Add New Item" button
    await page.getByRole('button', { name: 'Add New Item' }).click();

    // Verify modal opens with title "Create New Item"
    await expect(page.getByRole('heading', { name: 'Create New Item' })).toBeVisible();

    // 3. Fill in Title with "Test New Item"
    await page.getByLabel('Title').fill('Test New Item');

    // 4. Fill in Description with "This is a test description"
    await page.getByLabel('Description').fill('This is a test description');

    // 5. Select Status as "Active"
    await page.getByLabel('Status').selectOption('active');

    // 6. Click "Create Item" button
    await page.getByRole('button', { name: 'Create Item' }).click();

    // Verify modal closes
    await expect(page.getByRole('heading', { name: 'Create New Item' })).not.toBeVisible();

    // Verify new item "Test New Item" appears in the table
    await expect(page.getByText('Test New Item')).toBeVisible();

    // Verify item shows "Active" status badge
    // The new item should be in the table with Active status
    const newItemRow = page.locator('tr', { hasText: 'Test New Item' });
    await expect(newItemRow.getByText('Active')).toBeVisible();
  });
});
