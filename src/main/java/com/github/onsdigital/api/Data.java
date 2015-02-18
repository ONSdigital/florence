package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.json.Content;
import com.github.onsdigital.util.PathUtil;
import org.apache.commons.io.FileUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

@Api
public class Data
{
    @GET
    public List<String> getData(HttpServletRequest request, HttpServletResponse response)
    {
        return Arrays.asList(new String[] { "meow here ", "meow there"});
    }

    @POST
    public void postData(HttpServletRequest request, HttpServletResponse response, Content content) throws IOException {
        System.out.println(content.json);
        FileUtils.writeStringToFile(PathUtil.fromUri(request.getHeader("referer")).toFile(), content.json, Charset.forName("utf8"));
    }
}
