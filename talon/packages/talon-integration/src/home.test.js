const { getUrl, getModes } = require('./utils.js');

describe('Home', () => {
  getModes().forEach(mode => {
    it(`[${mode}] should display "Hurricane Harvey Immediate Assistance Program" text on page`, async () => {
      const page = await browser.newPage();

      // capture page errors
      const errors = [];
      page.on('pageerror', err => {
        errors.push(err);
      });

      await page.goto(getUrl('/', mode));

      await expect(page).toMatch('Hurricane Harvey Immediate Assistance Program');
      expect(errors).toHaveLength(0);
    });
  });
});