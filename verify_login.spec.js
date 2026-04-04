import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Login Security Verification', () => {
    test.beforeEach(async ({ page }) => {
        const filePath = `file://${path.resolve('index.html')}`;
        await page.goto(filePath);
    });

    test('Successful login with hashed PIN for Cashier', async ({ page }) => {
        await page.selectOption('#role-select', 'cashier');
        await page.fill('#login-pin', '1234');
        await page.click('button[onclick="app.login()"]');

        // Check if login screen is hidden and app screen is visible
        const loginScreen = page.locator('#login-screen');
        const appScreen = page.locator('#app-screen');

        await expect(loginScreen).toHaveClass(/hidden/);
        await expect(appScreen).not.toHaveClass(/hidden/);
        await expect(page.locator('#user-display')).toContainText('Rol: CASHIER');
    });

    test('Failed login with incorrect PIN', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('PIN Incorrecto');
            await dialog.dismiss();
        });

        await page.selectOption('#role-select', 'cashier');
        await page.fill('#login-pin', 'wrong-pin');
        await page.click('button[onclick="app.login()"]');
    });
});
