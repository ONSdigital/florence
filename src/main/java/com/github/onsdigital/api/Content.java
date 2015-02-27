package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.json.ReleaseContent;
import com.github.onsdigital.service.GithubContentService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.io.IOException;

@Api
public class Content
{
    @GET
    public ReleaseContent getData(HttpServletRequest request, HttpServletResponse response)
    {
        ReleaseContent item = new ReleaseContent();

        item.release = "thisRelease";
        item.owner = "thisOwner";

        return item;
    }

    @POST
    public void postContent(HttpServletRequest request, HttpServletResponse response, ReleaseContent content) throws IOException
    {
        GithubContentService service = new GithubContentService();
        service.submitContent(content.json, "path", "note", content.release, content.owner);
    }
}
