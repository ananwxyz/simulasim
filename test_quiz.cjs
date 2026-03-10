const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto('http://localhost:5173/register');
    await page.type('input[placeholder="Contoh: Budi Santoso"]', 'Tester');
    await page.type('input[type="email"]', 'tester@test.com');
    await page.click('button[type="submit"]'); // Start simulation

    await page.waitForNavigation();
    console.log("Current URL:", page.url());

    // click answers until end
    while (true) {
        try {
            await page.waitForSelector('.space-y-4 button', { timeout: 2000 });
            await page.evaluate(() => {
                const buttons = document.querySelectorAll('.space-y-4 button');
                buttons[0].click(); // click first option
            });
            await page.waitForTimeout(500);
            const nextBtnText = await page.evaluate(() => {
                const btn = document.querySelector('.mt-8 button');
                if (btn) btn.click();
                return btn ? btn.textContent : '';
            });
            console.log("Clicked:", nextBtnText);
            await page.waitForTimeout(500);
            if (nextBtnText.includes("Selesaikan")) {
                console.log("Quiz finished");
                break;
            }
        } catch (e) {
            console.log("Loop ended or error:", e.message);
            break;
        }
    }
    await browser.close();
})();
