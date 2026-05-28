import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173/equipo';
const outputDir = path.resolve(process.cwd(), 'artifacts', 'screenshots');

const viewports = [
  { name: 'equipo-desktop-1280', width: 1280, height: 900 },
  { name: 'equipo-tablet-768', width: 768, height: 1024 },
  { name: 'equipo-mobile-390', width: 390, height: 844 },
];

const capture = async () => {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForSelector('main', { timeout: 60000 });
      await page.waitForTimeout(800);

      const outputPath = path.join(outputDir, `${viewport.name}.png`);
      await page.screenshot({
        path: outputPath,
        fullPage: true,
      });

      await context.close();
      console.log(`Saved: ${outputPath}`);
    }
  } finally {
    await browser.close();
  }
};

capture().catch((error) => {
  console.error('Screenshot capture failed:', error);
  process.exit(1);
});
