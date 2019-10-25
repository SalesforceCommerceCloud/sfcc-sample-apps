# SFCC Sample Applications

Reference apps and libraries based on `LWC`, `LWR`, `sfcc-core` and `sfcc-bff`.


#### Setup
1) 	`git clone git@github.com:coopaq/sfcc-sample-apps.git`
2) `cd sfcc-sample-apps`
3)	`yarn`  (install if needed `npm install yarn -g`)
4)	`yarn build`
5)	`yarn start`


#### Developer Heroku Deploy
1) `heroku login` to open browser and login with `youremail@salesforce.com`
Create concierge ticket to get access if needed. https://concierge.it.salesforce.com/articles/en_US/Supportforce_Article/Heroku-for-SFDC-Employees
2) `heroku create` to create your own Heroku app.
3) `git remote -v` to ensure you have a repo in the Heroku git server. 
3) New Heroku app will be at https://dashboard.heroku.com/apps
4) Make any changes locally and git commit to your branch.
5) `git push heroku [yourbranch]:master` to deploy your changes.

e.g. Example live instance: https://arcane-reaches-49491.herokuapp.com/ 


#### Monorepo Instructions

sfcc-sample-apps is a monorepo with an sample application(s) and dendencies modules. Normally dependencies modules are published to a public npm server, but for the purpose of developing an application and the modules together everything is in a sinlge repository here (monorepo).

1) 
