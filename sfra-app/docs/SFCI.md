# Checking into Core

## TL;DR;

1. Find out your JAR's version number [in Nexus or in Github](#Nexus).
1. Open `~/blt/app/main/core/pom.xml`
1. Please update the following line with the version from step 1.
    ```xml
    <ui-communities-talon.version>220.#</ui-communities-talon.version>
    ```
1. Comment out the [changes you made when configuring your app](ConfigureCore.md) 
1. Run `blt --build update-repository-filter` to generate a new `artifacts.xml` file.
1. Add `pom.xml` and `artifacts.xml` to your P4 changelist alongside any Core changes you might have. 
1. Commit your changes as normal.

## SFCI/Jenkins

You may have noticed a few green checks (as well as a bunch of emails) about your tests and build passing. This is our SFCI Jenkin's instance running your Jest tests in the background to ensure coverage and quality. [Here live all of the live remote branches](https://communitiesci.dop.sfdc.net/).

When one of your builds fails, this is a great place to go in order to discover what might have caused it.

## Nexus

As soon as your pull request is merged into master, an SFCI build will run. If successful, it will place a new ui-communities-talon jar in Nexus. Please go [here to find your Nexus jar](https://nexus.soma.salesforce.com/nexus/#nexus-search;quick~ui-communities-talon). Each jar represents one successfully merged release branch.

If you want to see which JAR is yours, you can go to the [Github Repo](https://git.soma.salesforce.com/communities/talon) and select the Release tab.
![Releases tab](https://help.github.com/assets/images/help/releases/release-link.png)

These `sfci-220.#` releases represent each jar in Nexus. If you select one and check the latest commit then you'll see who was the contributor.

## Working in Core with the Nexus Jar

Previously you followed the [instructions on configuring core](ConfigureCore.md) to develop your LWC component locally. When the changes to your `workspace-user.xml` file are in, we are using the repository on your local. When they are removed, we are using the Nexus jar specified by your app. Let's remove them now.

To now consume your new jar, we will need to update `~/blt/app/main/core/pom.xml` with the new version number of our Nexus jar. [Reference the Nexus section](#Nexus) on how to find this version number.

1. Please then update the following line with that version number.
    ```xml
    <ui-communities-talon.version>220.#</ui-communities-talon.version>
    ```
1. Next please run `blt --build update-repository-filter` to generate a new `artifacts.xml` file.
1. Add both of these files to your P4 changelist alongside any Core changes you might have. 
1. Commit your changes as normal