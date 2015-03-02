package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.service.GithubContentService;
import com.mashape.unirest.http.exceptions.UnirestException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import java.io.IOException;

@Api
public class Release {

    @POST
    public void approveRelease(HttpServletRequest request, HttpServletResponse response) throws IOException, UnirestException {
        String owner = "ONSDigital"; // aka fork
        String release = "master"; // aka branch

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("owner"))
                owner = cookie.getValue();

            if (cookie.getName().equals("release"))
                release = cookie.getValue();
        }

        GithubContentService.approveRelease(owner, release);
    }
}
