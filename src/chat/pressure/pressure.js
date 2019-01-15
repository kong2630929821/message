const puppeteer = require('puppeteer');

(async () => {
    let pages = [];
    //创建机器人数量
    let count = 5;
    //设置浏览器最大打开页面数
    let pageMax = 30;

    for (let i = 0; i < count; i++) {
        let browser;
        if (i % pageMax === 0) {
            browser = await puppeteer.launch();
        }
        pages.push(addRobot(browser, i + 1, 'sign'));
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