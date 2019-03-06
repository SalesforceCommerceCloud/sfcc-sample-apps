# Git and Github Enterprise

We won't spend too much time going over how to use Git, but we will discuss how it will affect us while developing on this off-core repository.
>For a great git resource, please go to [Atlassian's git tutorial site](https://www.atlassian.com/git/tutorials/what-is-git)

## Enable Commit Signing

> **_THIS IS REQUIRED!_**

See [the Salesforce guide on Commit Signing](https://confluence.internal.salesforce.com/pages/viewpage.action?pageId=79771036) to activate your GPG keys and configure your system.

### Commit Signing Tooling
- [GPG Suite](https://gpgtools.org/) so that you can add your GPG key to your keychain.
- VSCode supports commit signing with the following setting `"git.enableCommitSigning": true`

## Working with Forks and Branches

1. Fork this repository. This creates an identical copy of the original repo but under your name.
 ![Fork Button](https://help.github.com/assets/images/help/repository/fork_button.jpg)
1. Clone this repository to your local filesystem. Please don't put it in the `blt` folder.
    ```bash
    git clone git@git.soma.salesforce.com:<YOUR_GITHUB_NAME>/talon.git
    ```
1. Let's add the upstream repository.
    ```bash
    git remote add upstream git@git.soma.salesforce.com:communities/talon.git
    ```

## Git Workflow

### Create a feature branch
```bash
git checkout master
git pull upstream master
git checkout -b <NAME_OF_THE_FEATURE>
```

### Make your changes
After testing your new code fully use the following commands:
```bash
git add <PATH_TO_FILES_TO_ADD>
git commit -m "<YOUR_COMMIT_MESSAGE>"
git push origin <NAME_OF_THE_FEATURE>
```

### Create a Pull Request

When you are ready for others to review your work, you can create a **New Pull Request** from [the primary repository](https://git.soma.salesforce.com/communities/talon) with your feature branch

![Compare & pull request](https://help.github.com/assets/images/help/pull_requests/pull-request-start-review-button.png)

