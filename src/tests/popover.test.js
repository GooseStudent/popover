const puppeteer = require('puppeteer');

const isPopoverActive = (page) =>
    page.evaluate(() => {
        const el = document.querySelector('.popover');
        return el ? el.classList.contains('active') : false;
    });

describe('Popover Widget', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 50,
        });
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        await page.evaluate(() => {
            if (window.__popover) window.__popover.hide();
        });
    });

    test('Открывается по клику на кнопку', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        const active = await isPopoverActive(page);
        expect(active).toBe(true);
    });

    test('Закрывается повторным кликом по кнопке', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        await page.click('.popover-btn');
        await page.waitForFunction(() => {
            const el = document.querySelector('.popover');
            return !el || !el.classList.contains('active');
        });
        const active = await isPopoverActive(page);
        expect(active).toBe(false);
    });

    test('Закрывается при клике на крестик', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        await page.click('.popover-close');
        const active = await isPopoverActive(page);
        expect(active).toBe(false);
    });

    test('Закрывается по Escape', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        await page.keyboard.press('Escape');
        const active = await isPopoverActive(page);
        expect(active).toBe(false);
    });

    test('Закрывается при клике вне попапа', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        await page.mouse.click(10, 10);
        const active = await isPopoverActive(page);
        expect(active).toBe(false);
    });

    test('Заголовок и текст берутся из data-атрибутов кнопки', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        const title = await page.$eval('.popover-title', (el) => el.textContent);
        const expected = await page.$eval('.popover-btn', (el) => el.dataset.popoverTitle);
        expect(title).toBe(expected);
    });
});