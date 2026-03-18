// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Editing Items', () => {
  test('Cancel Editing', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // 2. Click the "Edit" button on the first item
    const firstRow = page.locator('tbody tr').first();
    await firstRow.getByRole('button', { name: 'Edit' }).click();

    // Verify modal opens with pre-filled data
    await expect(page.getByRole('heading', { name: 'Edit Item' })).toBeVisible();
    const originalTitle = await page.getByLabel('Title').inputValue();

    // 3. Change the Title to "Modified Title"
    await page.getByLabel('Title').clear();
    await page.getByLabel('Title').fill('Modified Title');

    // 4. Click "Cancel" button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify modal closes
    await expect(page.getByRole('heading', { name: 'Edit Item' })).not.toBeVisible();

    // Verify original title remains unchanged in the table
    await expect(page.getByText(originalTitle)).toBeVisible();

    // Verify "Modified Title" does NOT appear
    await expect(page.getByText('Modified Title')).not.toBeVisible();
  });
});
