# Troubleshooting

## Expired Clover license

If your Clover trial license has expired, the Maven build (`mvn clean install`) will fail with the following error: 

```
[ERROR] Failed to execute goal com.atlassian.maven.plugins:clover-maven-plugin:4.1.2:instrumentInternal (clover-verify) on project ui-communities-talon: Execution clover-verify of goal com.atlassian.maven.plugins:clover-maven-plugin:4.1.2:instrumentInternal failed: Your license has expired..Please visit http://www.atlassian.com/ex/GenerateLicense.jspa to obtain a license. -> [Help 1]
```

To fix this, add the following to your `~/.m2/settings.xml` file: 

```xml
<profiles>
    <profile>
      <id>my-clover-profile</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
         <maven.clover.licenseLocation>[path to your home dir]/blt/tools/clover/clover.license</maven.clover.licenseLocation>
      </properties>
   </profile>
</profiles>
```