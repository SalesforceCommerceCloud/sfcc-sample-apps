---
includes:
  - { title: Setup, Nexus, fileName: Setup.md }
  - { title: Getting Started with Git and Github, fileName: Git.md }
  - { title: Configure your Core App, fileName: ConfigureCore.md }
  - { title: Configure your Local Repo, fileName: Yarn.md }
  - { title: Configure your VSCode, fileName: VSCode.md }
  - { title: Configure your Eclipse, fileName: Eclipse.md }
  - { title: Building and Starting Locally, fileName: BuildAndStart.md }
  - { title: Testing and Debugging, fileName: Testing.md }
  - { title: Checking Into Core, fileName: SFCI.md }
  - { title: LWC Best Practices, fileName: BestPractices.md }

preferences:
  forking: true
  yarnReady: true
  ignoreEngines: false

repo:
  publicName: Talon
  org: communities
  qualifiedName: talon

readme:
  footer: "For help please go to our [support doc](SUPPORT.md)"
  description: | 
    Communities Lightning Web Framework :sunglasses:

    The goal of a Raptor Only Runtime, known here as Talon, is to provide a **fast**, standards-based LWC application framework. This web framework will allow any Salesforce team or cloud to support true **B2C experience** with a lightweight development environment to enhance **developer productivity**. 

    The framework will be built with the following principles in mind: 
    
    - Performance
    - Standards-Based
    - Adhere to the [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) / [PRPL Pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) principles
    - Scalability
    - LWC as a first-class citizen
    - Off Core development

    If you want to learn more please check out our architecure document here [🏗 Raptor Only Runtime - Architecture](https://quip.com/HaDpABWuNFRg).

release:
  version: 220

sfci:
  url: https://communitiesci.dop.sfdc.net/
  jar:
    name: ui-communities-talon

support:
  team:
    name: Communities Next Gen
    url: https://gus.lightning.force.com/0F9B0000000IMmxKAG
  accessibility:
    name: Donielle Berg
    email: d.berg@salesforce.com

# namespace:
#   primaryPrefix: community_
#   global:
#     name: lightningcommunity
#     location: "on Core in ui-communities-components"
...