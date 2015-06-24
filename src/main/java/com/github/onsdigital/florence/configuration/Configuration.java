package com.github.onsdigital.florence.configuration;

import org.apache.commons.lang3.StringUtils;

public class Configuration {

    private static final String DEFAULT_BABBAGE_URL = "http://localhost:8080";
    private static final String DEFAULT_ZEBEDEE_URL = "http://localhost:8082";

    public static String getBabbageUrl() {
        return StringUtils.defaultIfBlank(getValue("BABBAGE_URL"), DEFAULT_BABBAGE_URL);
    }

    public static String getZebedeeUrl() {
        return StringUtils.defaultIfBlank(getValue("ZEBEDEE_URL"), DEFAULT_ZEBEDEE_URL);
    }

    /**
     * Gets a configured value for the given key from either the system
     * properties or an environment variable.
     * <p/>
     * Copied from {@link com.github.davidcarboni.restolino.Configuration}.
     *
     * @param key The name of the configuration value.
     * @return The system property corresponding to the given key (e.g.
     * -Dkey=value). If that is blank, the environment variable
     * corresponding to the given key (e.g. EXPORT key=value). If that
     * is blank, {@link org.apache.commons.lang3.StringUtils#EMPTY}.
     */
    static String getValue(String key) {
        return StringUtils.defaultIfBlank(System.getProperty(key), System.getenv(key));
    }
}
