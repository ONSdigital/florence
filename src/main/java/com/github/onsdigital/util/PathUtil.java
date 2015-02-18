package com.github.onsdigital.util;

import com.github.onsdigital.configuration.Configuration;

import java.net.URI;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;

public class PathUtil
{
    public static Path fromUri(String uri)
    {
        Path taxonomy = FileSystems.getDefault().getPath(
                Configuration.getTaxonomyPath());
        return getDataPath(uri, taxonomy);
    }

    /**
     * Resolve the path the data is located from the uri.
     * @param uriString
     * @param taxonomy
     * @return
     */
    public static Path getDataPath(String uriString, Path taxonomy)
    {
        URI uri = URI.create(uriString);
        String uriPath = cleanPath(uri);

        // Look for a data.json file, or
        // fall back to adding a .json file extension
        Path data = taxonomy.resolve(uriPath).resolve("data.json");
        if (!Files.exists(data)) {
            data = taxonomy.resolve(uriPath + ".json");
        }

        return data;
    }

    /**
     * @param uri
     *            The URI to get a standardised path from.
     * @return The URI path, lowercasted, without the endpoint name or trailing
     *         slash.
     */
    public static String cleanPath(URI uri)
    {
        String result = uri.getPath();

        // Remove slashes:
        if (result.startsWith("/")) {
            result = result.substring(1);
        }
        if (result.endsWith("/")) {
            result = result.substring(0, result.length() - 1);
        }

        // Remove endpoint name:
        String endpointName = "data/";
        if (result.startsWith(endpointName)) {
            result = result.substring(endpointName.length());
        }

        // Lowercase
        result = result.toLowerCase();

        return result;
    }
}
