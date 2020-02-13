# Table of Contents

- [Submitting Your First Pull Request ](#submitting-Your-First-Pull-Request)

- [Submitting a Pull Request ](#Submitting-a-Pull-Request)

- [What to Expect](#What-to-Expect)

- [Team Members](#sfcc-sample-apps-Team-Members)

- [Back to README](./README.md)

# Contributing to sfcc-sample-apps

To contribute to sfcc-sample-apps, follow the guidelines below. This helps us address your pull request in a more timely manner. 

## Submitting Your First Pull Request
If this is your first pull request, follow these steps:

  1. Create a fork of the sfcc-sample-apps repository 

  2. Download the forked repository

  3. Checkout the integration branch

  4. Apply your code fix

  5. Create a pull request against the integration branch

## Submitting a Pull Request
  1. Create a branch off the integration branch.

       * To reduce merge conflicts, squash and rebase your branch before submitting your pull request.
   
       * If applicable, reference the issue number in the comments of your pull request.
   
  2. In your pull request, include:

       * A brief description of the problem and your solution
       
       * Steps to reproduce
   
       * Screen shots
   
       * Error logs
   
  3. Grant sfcc-sample-apps team members access to your fork so we can run an automated test on your pull request prior to merging it into our integration branch.

       * From within your forked repository, find the 'Settings' link (see the site navigation on left of the page).
   
       * Under the settings menu, click 'User and group access'.
   
       * Add the new user to the input field under the heading 'Users' and give the new user write access.
   
  4. Indicate if there is any data that needs to be included with your code submission. 

  5. Your code should build and pass any tests including linting.

       * Lint your code:  
         `yarn lint` 	 
       * Run and pass the unit test:  
         `yarn test`
  6. Monitor your pull requests.
       
       * please respond in a timely manner to hany comments, questions for changes requested.
       
       * we may close abandoned pull requests.

## What to Expect

After you submit your pull request, we'll look it over and consider it for merging.

As long as your submission has met the above guidelines, we should merge it in a timely manner. However; please keep in
mind the following:
* If the changes affect security (including but not limited to PCI, PII, Session Management). The changes will need to be reviewed by a member of our product security team.
* All UX changes (even trivial ones) will require a UX approval before it can be merged.
* If there is a change to the documentation or UI text the documentation team will need to review the proposed changes and sign off of them.
* PM sign off on value of the enhancements in the domain.

Our sprints run for about two weeks; in that period of time, we typically review all pull requests, give feedback, and merge the request (depending on our current sprint priorities).

## sfcc-sample-apps Team Members 

To speed up the process of reviewing and merging your pull request, grant the following team members access to your fork:

  * _SFRA_ Admins 
  
 
## Contributer License Agreement (CLA)

All external contributors must sign our Contributor License Agreement (CLA).  
