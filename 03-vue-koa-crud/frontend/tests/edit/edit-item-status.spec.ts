// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Editing Items', () => {
  test('Edit Item Status', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // 2. Click the "Edit" button on the first item (which is active)
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow.getByText('Active')).toBeVisible();
    await firstRow.getByRole('button', { name: 'Edit' }).click();

    // Verify modal opens
    await expect(page.getByRole('heading', { name: 'Edit Item' })).toBeVisible();

    // 3. Change Status to "Inactive"
    await page.getByLabel('Status').selectOption('inactive');

    // 4. Click "Save Changes" button
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify modal closes
    await expect(page.getByRole('heading', { name: 'Edit Item' })).not.toBeVisible();

    // Verify the item now shows "Inactive" status badge
    const updatedRow = page.locator('tbody tr').first();
    await expect(updatedRow.getByText('Inactive')).toBeVisible();
  });
});
