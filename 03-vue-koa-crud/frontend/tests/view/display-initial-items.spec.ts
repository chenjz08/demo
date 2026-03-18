// spec: specs/crud-operations.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Viewing Item List', () => {
  test('Display Initial Items', async ({ page }) => {
    // 1. Navigate to the application root
    await page.goto('/');

    // 2. Wait for the data to load and verify page heading
    await expect(page.getByRole('heading', { name: 'Project Dashboard' })).toBeVisible();

    // Verify the subtitle text is shown
    await expect(page.getByText('Manage your items beautifully')).toBeVisible();

    // Verify the "Add New Item" button is visible
    await expect(page.getByRole('button', { name: 'Add New Item' })).toBeVisible();

    // Verify the table has items loaded (at least one row)
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 });

    // Verify table headers
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();

    // Verify each row has Edit and Delete buttons
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      await expect(row.getByRole('button', { name: 'Edit' })).toBeVisible();
      await expect(row.getByRole('button', { name: 'Delete' })).toBeVisible();
    }

    // Verify status badges exist (Active or Inactive)
    const statusBadges = page.locator('tbody tr span');
    const badgeCount = await statusBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });
});
