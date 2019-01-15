package org.talon;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class TalonInfo {

    private static final String DEVELOPMENT = "development";

    private static final String PROPERTIES_PATH = "/talon.properties";

    /**
     * Get current Talon version from properties file.
     *  
     * Defaults to "development" if version cannot be read from talon.properties.
     * 
     * Note that this method is not synchronized and will read from the classpath resource every time
     * i.e. it's meant to be used in a static initializer. 
     *
     * @return Talon version
     */
    public static String getTalonVersion() {
        Properties talonProps = new Properties();
        String talonVersion = DEVELOPMENT;
        try (InputStream in = TalonInfo.class.getResourceAsStream(PROPERTIES_PATH)) {
            talonProps.load(in);
            talonVersion = talonProps.getProperty("pom.version");
        } catch (IOException ignored) {}
        return talonVersion;
    }
}