import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const logs = [];
page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`[pageerror] ${err.stack || err.message}`));
page.on('requestfailed', (req) => logs.push(`[requestfailed] ${req.url()} :: ${req.failure()?.errorText}`));

await page.goto('http://127.0.0.1:4173/tools/sign-pdf', { waitUntil: 'networkidle' });
await page.locator('input[type="file"]').first().setInputFiles('/tmp/sign-test-70-pages.pdf');
await page.waitForTimeout(1500);
await page.getByRole('button', { name: /type/i }).first().click();
await page.getByLabel('Signature text').fill('John Doe');
await page.getByLabel('Apply signature to').selectOption('pages');
await page.getByLabel('Page numbers').fill('1,2,3');
await page.getByRole('button', { name: /add signature/i }).click();
await page.getByRole('button', { name: /download signed pdf/i }).click();
await page.waitForTimeout(2500);
console.log(logs.join('\n'));
await browser.close();
