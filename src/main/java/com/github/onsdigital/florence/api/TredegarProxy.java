package com.github.onsdigital.florence.api;

import com.github.davidcarboni.restolino.framework.Filter;
import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
* Routes all traffic to Tredegar, Unless it is recognised as a florence file being requested.
*/
public class TredegarProxy implements Filter {

    private static String florenceToken = "/florence";
    private static String tredegarBaseUrl = "http://localhost:8080";

    @Override
    public boolean filter(HttpServletRequest request, HttpServletResponse response) {

        try {

            if (request.getRequestURI().startsWith(florenceToken)) {
                return true; // carry on and serve the file from florence
            }

            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet(tredegarBaseUrl + request.getRequestURI());
            CloseableHttpResponse tredegarResponse = httpClient.execute(httpGet);

            try {
                HttpEntity responseEntity = tredegarResponse.getEntity();

                // copy headers from the response
                for (Header header : tredegarResponse.getAllHeaders()) {
                    response.setHeader(header.getName(), header.getValue());
                }

                IOUtils.copy(responseEntity.getContent(), response.getOutputStream());
                EntityUtils.consume(responseEntity);

            } catch (IOException e) {
                return true;
            } finally {
                tredegarResponse.close();
            }

        } catch (IOException e) {
            return true;
        }

        return false;
    }
}