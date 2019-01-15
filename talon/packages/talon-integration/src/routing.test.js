const { getUrl, getPath, getModes } = require('./utils.js');
const { parseUrl } = require('talon-common');

describe('Routing', () => {
  getModes().forEach(mode => {
    it(`[${mode}] should load page components lazily`, async () => {
      // open home page
      const page = await browser.newPage();

      // capture page errors
      const errors = [];
      page.on('pageerror', err => {
        errors.push(err);
      });

      await page.goto(getUrl('/about', mode));

      // capture requests
      await page.setRequestInterception(true);
      const requests = [];
      page.on('request', (request) => {
        requests.push(request);
        request.continue();
      });

      // navigate to About page
      const navigationPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
      await expect(page).toClick(`talon-router-link a[href="${getPath('/faq', mode)}"]`);
      await navigationPromise;
      await expect(page.url()).toBe(getUrl('/faq', mode));
      expect(errors).toHaveLength(0);

      // verify only the page component has been loaded
      // and no other request
      expect(requests).toHaveLength(1);

      const { type: actualType, name: actualName, mode: actualMode } = parseUrl(requests[0].url().split(`:${global.port}`)[1]);
      expect({ type: actualType, name: actualName, mode: actualMode }).toEqual({
        type: 'view',
        name: 'faq',
        mode: mode === 'default' ? 'dev' : mode
       });
    });

    it(`[${mode}] should load theme layout components lazily`, async () => {
      // open home page
      const page = await browser.newPage();

      // capture page errors
      const errors = [];
      page.on('pageerror', err => {
        errors.push(err);
      });

      await page.goto(getUrl('/', mode));

      // capture requests
      await page.setRequestInterception(true);
      const requests = [];
      page.on('request', (request) => {
        requests.push(request);
        request.continue();
      });

      // navigate to About page
      const navigationPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
      await expect(page).toClick(`talon-router-link a[href="${getPath('/about', mode)}"]`);
      await navigationPromise;
      await expect(page.url()).toBe(getUrl('/about', mode));
      expect(errors).toHaveLength(0);

      // verify only the page component has been loaded
      // and no other request
      expect(requests).toHaveLength(2);

      const { type: actualThemeLayoutType, name: actualThemeLayoutName, mode: actualThemeLayoutMode } = parseUrl(requests[0].url().split(`:${global.port}`)[1]);
      expect({ type: actualThemeLayoutType, name: actualThemeLayoutName, mode: actualThemeLayoutMode }).toEqual({
        type: 'view',
        name: 'headerAndFooter',
        mode: mode === 'default' ? 'dev' : mode
       });

      const { type: actualLayoutType, name: actualLayoutName, mode: actualLayoutMode } = parseUrl(requests[1].url().split(`:${global.port}`)[1]);
      expect({ type: actualLayoutType, name: actualLayoutName, mode: actualLayoutMode }).toEqual({
        type: 'view',
        name: 'about',
        mode: mode === 'default' ? 'dev' : mode
       });
    });
  });
});