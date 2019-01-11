const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    let pages = [];
    let count = 5;
    for (let i = 1; i <= count; i++) {
        pages.push(addRobot(browser, i, 'xxx'));
    }
    await Promise.all(pages);
})();

async function addRobot(browser, openid, sign) {
    console.log('start openid!!!!', openid);
    const page = await browser.newPage();
    let url = `http://127.0.0.1/wallet/chat/pressure/boot/index.html?openid=${openid}&sign=${sign}`;
    console.log('goto url:', url);
    page.on('console', msg => {
        console.log(msg.text());
    });
    await page.goto(url);
    return page.waitFor(60 * 1000);
}