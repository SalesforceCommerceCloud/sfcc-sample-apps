# Developing LWC with Eclipe

Welcome back to the world full of build problems. We missed you.

## Configure Eclipse

If your normal workflow is to run `blt --config --eclipse`, you can easily add your new module to your Eclipse workspace for convenience:

1. Open Eclipse using `blt --eclipse`.
1. Go to File -> Import -> Existing Maven Projects.
    >This requires the M2E Plugin: http://www.eclipse.org/m2e/
1. Select the folder with your module, i.e. the location of your local Git repository.
1. Import the project. Expand "Advanced" in "Import Maven Projects" modal and set "Name template:" to `[artifactId]`. Yes, with the brackets.
1. Run the usual BLT commands you would after Eclipse finished building.

### Troubleshooting Eclipse

#### The container 'Maven Dependencies' references non existing library '/home/USER/.m2/repository/org/auraframework/aura-interfaces/VERSION/aura-interfaces-VERSION.jar

If the previous statement is showing up in Eclipse as a build error, you likely are missing your `~/.m2/settings.xml` file. To fix this, run:

    blt mvn-build:--config

(Source: https://gus.my.salesforce.com/0D5B000000cANxgKAG)

### Intellij Development

:wrench: In progress :wrench:
