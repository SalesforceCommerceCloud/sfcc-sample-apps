Feature('home');

Scenario('Load a product starting from the home page', I => {
    I.amOnPage('/');
    I.see('Summer Look');
    I.see('Popular Catalogs');
    I.click('Dresses');
    I.see('Floral Dress');
    I.click('Floral Dress');
    I.see('Item No. 25592581M');
    I.see('Description');
    I.see('Details');
});
