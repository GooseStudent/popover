const puppeteer = require('puppeteer'); //бибилиотека 

describe('Popover Widget', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 100
        });
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Закрытие при нажати на крестик', async () => {
        await page.click('.popover-btn'); 
        await page.click('.popover-close');
        
        const popover = await page.$('.popover');
        const isVisible = await page.evaluate(el => {
            return el.classList.contains('active');
        }, popover);
        
        expect(isVisible).toBe(false);
    });

    test('Закрытие окна при нажатии на ESC', async () => {
        await page.click('.popover-btn'); 
        await page.keyboard.press('Escape');
        
        const popover = await page.$('.popover');
        const isVisible = await page.evaluate(el => {
            return el.classList.contains('active');
        }, popover);
        
        expect(isVisible).toBe(false);
    });

    test('Закрытие при клике на пустую область', async () => {
        await page.click('.popover-btn');
        await page.waitForSelector('.popover.active');
        
        // Проверяем что открылся
        const popover = await page.$('.popover');
        let isVisible = await page.evaluate(el => {
            return el.classList.contains('active');
        }, popover);
        expect(isVisible).toBe(true);
        

        await page.mouse.click(50, 50);         // Клик в пустое место 
        
        
        isVisible = await page.evaluate(el => {
            return el.classList.contains('active');
        }, popover);
        
        expect(isVisible).toBe(false);
    });
});