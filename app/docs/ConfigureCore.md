# Configure Core

## TL;DR

The end result should be a `workspace-user.xml` file that looks a bit like this:

```xml
    <?xml version="1.0" ?>
    <workspace>
        <modules>
            ...
        </modules>
        <moduleImports>
            <moduleImport>/the/location/of/this/git/repository/on/your/local/machine/talon</moduleImport>
        </moduleImports>
        <properties>
            <repository.system.validation>DISABLED</repository.system.validation>
            <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
            <skipJsDoc>true</skipJsDoc>
            <ui-communities-talon.version>220-SNAPSHOT</ui-communities-talon.version>
        </properties>
    </workspace>
```

## Step-by-Step

1. Open `~/blt/app/main/core/workspace-user.xml` to edit

1. Add a `<moduleImport>` entry under the `<moduleImports>` node, updating the value of the entry to be the absolute path to the location of your cloned repository. `<moduleImports>` is under `<workspace>` node.
    ```xml
        <moduleImports>
            <moduleImport>/the/location/of/this/git/repository/on/your/local/machine/talon</moduleImport>
        </moduleImports>
    ```
1. Add the following properties to the `<properties>` node if they are not already present. `<properties>` node is under `<workspace>` node.
    ```xml
        <properties>
            <repository.system.validation>DISABLED</repository.system.validation>
            <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
            <skipJsDoc>true</skipJsDoc>
        </properties>
    ```
1. Add a `<ui-communities-talon.version>` entry under the `<properties>` node from Step 3. Update the `220-SNAPSHOT` value to match the version listed at the top of this modules's [POM file](../pom.xml). It will be between the `<version> ... </version>` tags. This tells Core to use the version in our local repository rather than download a JAR.
    ```xml
        <properties>
            <repository.system.validation>DISABLED</repository.system.validation>
            <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
            <skipJsDoc>true</skipJsDoc>
            <ui-communities-talon.version>220-SNAPSHOT</ui-communities-talon.version>
        </properties>
    ```
    > **Important**: When you want to consume artifacts from Core comment out all of these changes. You don't want to think you are using the JAR in core when you are actually using your local :weary:

## **Important**: Branch Mismatch

When working with any branch other than the current release branch (e.g. 214), make sure the repositories point to the same release.

  ```sh
  # In this repository, check out the proper branch:
  git checkout 214
  ```
  In the `workspace-user.xml` _for the 214 branch_, reference the correct release JAR:
  ```xml
  <ui-communities-talon.version>214-SNAPSHOT</ui-communities-talon.version>
  ```
