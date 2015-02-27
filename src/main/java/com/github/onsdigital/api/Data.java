package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.json.Content;
import com.github.onsdigital.service.GithubContentService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Api
public class Data {
	@GET
	public List<String> getData(HttpServletRequest request,
			HttpServletResponse response) {
		return Arrays.asList("meow here ", "meow there");
	}

	@POST
	public void postData(HttpServletRequest request,
			HttpServletResponse response, Content content) throws IOException {

        String owner = "ONSDigital"; // aka fork
        String release = "master"; // aka branch

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("owner"))
                owner = cookie.getValue();

            if (cookie.getName().equals("release"))
                release = cookie.getValue();
        }

        GithubContentService service = new GithubContentService();
        service.submitContent(content.json, content.id, owner + " commit to " + release, release, owner);
	}
}
