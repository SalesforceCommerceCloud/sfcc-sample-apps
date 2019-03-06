# Setup
 
## Configure access to git.soma.salesforce.com

[Set up SSH access to git.soma.salesforce.com][setup-github-ssh] if you haven't done so already.

## Install node

We recommend installing node using a version manager like [n][n] or [nvm][nvm].
This will allow you to avoid using sudo while installing things, which is
generally a bad practice.

## Install yarn

We use [yarn][yarn] to manage our npm dependencies.

Currently we require version 1.9.4 as we found issues with later versions. 

```bash
npm install --global yarn@1.9.4
```

Or if you have multiple installtions of `yarn`, this way might help: 

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash -s - --version 1.9.4
```

## Set up access to internal nexus

https://git.soma.salesforce.com/modularization-team/maven-settings

If you get a "sun.security.validator.ValidatorException" exception, then you
will need to [add a trusted certificate authority to Java][how-to-add-cert].

## Set up access to internal npm

https://sfdc.co/npm-nexus

[how-to-add-cert]: https://sites.google.com/a/salesforce.com/security/services/requests/new-certificate-and-certificate-renewal-requests/creating-or-revoking-an-internal-certificate/internal-root-certificate-information/adding-a-trusted-certificate-authority/how-to-add-a-trusted-certificate-authority-to-java
[n]: https://github.com/tj/n
[nvm]: http://nvm.sh
[setup-github-ssh]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
[yarn]: https://yarnpkg.com/
