# SFCC Sample Applications

Reference apps and libraries based on `LWC`, `LWR`, `sfcc-core` and `sfcc-bff`.


#### Setup
1) 	`git clone git@github.com:coopaq/sfcc-sample-apps.git`
2) `cd sfcc-sample-apps`
3)	`yarn`
4)	`yarn run build`
5)	`yarn run start`


#### Developer Heroku Deploy
1) `heroku login` to open browser and login with `youremail@salesforce.com`
2) `heroku create` to create your own Heroku app.
3) `git remote -v` to ensure you have a repo in the Heroku git server. 
3) New Heroku app will be at `https://dashboard.heroku.com/apps`
4) Make any changes locally and git commit to master.
5) `git push heroku master` to deploy your changes.
