const { getUrl, getModes } = require('./utils.js');
const faker = require('faker');

describe('Confirmation', () => {
  getModes().forEach(mode => {
    it(`[${mode}] form should redirect to confirmation page`, async () => {
      const page = await browser.newPage();

      // capture page errors
      const errors = [];
      page.on('pageerror', err => {
        errors.push(err);
      });

      await page.goto(getUrl('/', mode));

      // fill the form
      await expect(page).toFill('.immediate-assistance-name input', faker.name.findName());
      await expect(page).toFill('.immediate-assistance-address textarea', faker.address.streetAddress("###"));
      await expect(page).toFill('.immediate-assistance-address input[name="city"]', faker.address.city());
      await expect(page).toFill('.immediate-assistance-address input[name="province"]', faker.address.stateAbbr());
      await expect(page).toFill('.immediate-assistance-address input[name="postalCode"]', faker.address.zipCode());
      await expect(page).toFill('.immediate-assistance-telephone input', faker.phone.phoneNumber());
      await expect(page).toFill('.immediate-assistance-email input', faker.internet.email());

      // click submit
      await expect(page).toClick('community_flashhelp-form button');

      // verify
      await page.waitForSelector('.confirmation h1');
      await expect(page).toMatch('Thank you for applying for the Hurricane Harvey Immediate Assistance Program');
      await expect(page.url()).toBe(getUrl('/confirmation', mode));

      if (mode.indexOf('prod') === 0) {
        expect(errors).toHaveLength(0);
      }
    });
  });
});