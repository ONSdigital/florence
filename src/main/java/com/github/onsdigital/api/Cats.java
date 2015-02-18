package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.configuration.Configuration;
import com.github.onsdigital.json.Content;
import org.apache.commons.io.FileUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

@Api
public class Cats
{
    @GET
    public List<String> cats(HttpServletRequest request, HttpServletResponse response)
    {
        return Arrays.asList(new String[] { "meow here ", "meow there"});
    }

    @POST
    public void cats(HttpServletRequest request, HttpServletResponse response, Content content) throws IOException {
        System.out.println(content.json);
        FileUtils.writeStringToFile(getDataPath(request.getHeader("referer")).toFile(), content.json, Charset.forName("utf8"));
    }

    /**
     * Resolve the path the data is located from the uri.
     * @param uriString
     * @return
     */
    public static Path getDataPath(String uriString)
    {
        URI uri = URI.create(uriString);
        String uriPath = cleanPath(uri);
        Path taxonomy = FileSystems.getDefault().getPath(
                Configuration.getTaxonomyPath());

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
    public static String cleanPath(URI uri) {

        // It would be nice to use StringBuilder,
        // but it doesn't have the manipulation methods we need
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
