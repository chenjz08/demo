// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Deleting Items', () => {
  test('Cancel Delete Item', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // Note the current number of items
    const initialCount = await page.locator('tbody tr').count();

    // 2. Set up dialog handler to dismiss the confirmation
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    // 3. Click the "Delete" button on the first item
    await page.locator('tbody tr').first().getByRole('button', { name: 'Delete' }).click();

    // Wait a moment for any potential changes
    await page.waitForTimeout(500);

    // Verify the item remains in the table - count unchanged
    await expect(page.locator('tbody tr')).toHaveCount(initialCount);

    // Verify the first item is still visible
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible();
  });
});
