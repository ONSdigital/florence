package com.github.onsdigital.configuration;

import org.apache.commons.lang3.StringUtils;

public class Configuration
{
    private static final String DEFAULT_TAXONOMY_ROOT = "./../nightingale/taxonomy";

    public static String getTaxonomyPath() {
        return StringUtils.defaultIfBlank(getValue("TAXONOMY_DIR"), DEFAULT_TAXONOMY_ROOT);
    }

    /**
     * Gets a configured value for the given key from either the system
     * properties or an environment variable.
     * <p>
     * Copied from {@link com.github.davidcarboni.restolino.Configuration}.
     *
     * @param key
     *            The name of the configuration value.
     * @return The system property corresponding to the given key (e.g.
     *         -Dkey=value). If that is blank, the environment variable
     *         corresponding to the given key (e.g. EXPORT key=value). If that
     *         is blank, {@link StringUtils#EMPTY}.
     */
    static String getValue(String key) {
        return StringUtils.defaultIfBlank(System.getProperty(key), System.getenv(key));
    }
}
