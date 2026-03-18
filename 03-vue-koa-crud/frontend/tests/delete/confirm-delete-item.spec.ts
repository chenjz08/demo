// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Deleting Items', () => {
  test('Confirm Delete Item', async ({ page }) => {
    // 1. Navigate and wait for app to load
    await page.goto('/');
    await expect(page.getByText('Learn Vite 8.0')).toBeVisible({ timeout: 10000 });

    // Note the current number of items
    const initialCount = await page.locator('tbody tr').count();

    // 2. Set up dialog handler BEFORE triggering the action
    page.once('dialog', (dialog) => dialog.accept());

    // 3. Click the "Delete" button on the last item (Vue 3 Composition API)
    const lastRow = page.locator('tbody tr').last();
    await lastRow.getByRole('button', { name: 'Delete' }).click();

    // Verify the item is removed - count decreases by one
    await expect(page.locator('tbody tr')).toHaveCount(initialCount - 1);
  });
});
