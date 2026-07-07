import { test, expect } from '@playwright/test';

test.describe('Analyst Dashboard Queue Integration', () => {
  test('successfully triggers job, polls, and shows toast notification', async ({ page }) => {
    // 1. Setup API Intercepts

    // Intercept the draft alerts fetch (initial load)
    let draftRequestCount = 0;
    await page.route('**/rest/v1/market_alerts?status=eq.DRAFT*', async (route) => {
      draftRequestCount++;
      if (draftRequestCount === 1) {
        // Initial load: 2 items
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: '1' }, { id: '2' }])
        });
      } else {
        // After completion: 5 items (3 new alerts)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }])
        });
      }
    });

    // Intercept the trigger job POST request
    await page.route('**/rest/v1/generate_market_alerts_status', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ run_id: 'mock-run-123' })
        });
      } else {
        route.continue();
      }
    });

    // Intercept the polling GET request
    let pollCount = 0;
    await page.route('**/rest/v1/generate_market_alerts_status?run_id=eq.mock-run-123*', async (route) => {
      pollCount++;
      if (pollCount === 1) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ run_id: 'mock-run-123', status: 'PENDING' })
        });
      } else if (pollCount === 2) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ run_id: 'mock-run-123', status: 'IN_PROGRESS' })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ run_id: 'mock-run-123', status: 'COMPLETED' })
        });
      }
    });

    // We don't have the full app running in playwright here (it needs a local dev server),
    // but assuming standard playwright setup with baseURL.
    // For this demonstration, we'll navigate to the dashboard.
    // Replace with the actual URL if testing locally.
    await page.goto('/analyst');

    // Ensure the dashboard loads
    await expect(page.getByText('Analyst Review Queue')).toBeVisible();

    // The button should say Fetch Latest News
    const fetchButton = page.getByRole('button', { name: /Fetch Latest News/i });
    await expect(fetchButton).toBeVisible();

    // Trigger the job
    await fetchButton.click();

    // Since our mock is instantaneous, it will hit PENDING quickly
    await expect(page.getByRole('button', { name: /Waiting in Queue/i })).toBeVisible();

    // The polling is mocked to return IN_PROGRESS on the second call (after 2s)
    await expect(page.getByRole('button', { name: /Generating AI Alerts/i })).toBeVisible({ timeout: 10000 });

    // The polling is mocked to return COMPLETED on the third call (after 4s)
    // The button should reset to Fetch Latest News
    await expect(page.getByRole('button', { name: /Fetch Latest News/i })).toBeVisible({ timeout: 10000 });

    // The toast should appear indicating 3 new alerts were generated
    await expect(page.getByText('Successfully generated 3 new alerts!')).toBeVisible();
  });
});
