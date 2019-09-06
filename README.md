# Sample Application with LWC

The reference app based on `LWC`, `Talon`, `@sfcc-core/[core modules]` and `@sfcc-lib/[modules]`.

SFCC Core and Library Modules source located at: 
[sfcc-core](https://github.com/coopaq/sfcc-core)
[sfcc-lib](https://github.com/coopaq/sfcc-lib)

#### Setup
1) 	`git clone git@github.com:coopaq/sample-app-lwc.git`
2) `cd sample-app-lwc`
3)	`npm install`
4)	`npm run build`
5)	`npm run start`

#### Ecom Setup
1) please edit `scripts/api.js` to point to your Ecom Instance.

#### Heroku - Create your Heroku "App"
1) Open `https://dashboard.heroku.com/` in browser.
2) Select your enterprise account. E.g. `commerce-cloud-runtime`.
3) Create or select your team.
4) Create or select your *"unique named"* app. e.g `sample-app-lwc-1`

#### Heroku - Deploy your Heroku "App"
1) At prompt type `heroku login` (Web browser will open for Heroku login)
2) In `sample-app-lwc` folder `heroku git:remote -a sample-app-lwc-1`
3) `git add .`
4) `git commit -am "make it better"`
5) `git push heroku master`

Full documentation on managing and deploying to Heroku are [here](https://devcenter.heroku.com/articles/git).
