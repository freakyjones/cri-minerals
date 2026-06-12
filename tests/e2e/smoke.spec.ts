import { test, expect } from '@playwright/test';

test.describe('Critical Minerals Dashboard Smoke Tests', () => {
  test('Dashboard loads and grid renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check header
    await expect(page.locator('h1')).toContainText('Critical Minerals Intelligence');
    
    // Check that at least one mineral card is rendered. We can look for the 'RiskHeatmap' component and the Grid.
    // The Risk Heatmap should have 'Critical Risk', 'High Risk', etc.
    await expect(page.getByText('Critical Risk')).toBeVisible();
    
    // Check for grid items
    // Assuming the MineralCard has a role or some text. Let's look for "Lithium" or "Cobalt" which are likely in the MVP data.
    // We can also just check that some links are present.
    const cardLinks = page.locator('a[href^="/mineral/"]');
    await expect(cardLinks.first()).toBeVisible();
    const count = await cardLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navigation from Dashboard to a specific Mineral Detail page works', async ({ page }) => {
    await page.goto('/');
    
    const cardLink = page.locator('a[href^="/mineral/"]').first();
    await expect(cardLink).toBeVisible();
    
    // Click the first mineral card
    await cardLink.click();
    
    // Verify we navigated to the detail page (URL contains /mineral/)
    await expect(page).toHaveURL(/\/mineral\/.+/);
    
    // The detail page has a back button
    await expect(page.getByText('Back to Dashboard')).toBeVisible();
    
    // Global Reserves or Active Production chart headers should be visible
    await expect(page.getByText('Global Reserves')).toBeVisible();
  });

  test('Market Alerts fetch and display successfully', async ({ page }) => {
    await page.goto('/');
    
    // Look for the Market Alerts sidebar
    await expect(page.getByText('Market Alerts')).toBeVisible();
    
    // Check that there is at least one alert if it's loaded, 
    // or just ensure the loading skeleton completes.
    // Since we are using demo data, it should load.
    const alertItems = page.locator('p.font-bold');
    await expect(alertItems.first()).toBeVisible();
  });
});
