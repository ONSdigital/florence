package com.github.onsdigital.json.github;

/**
 * POST /repos/:owner/:repo/pulls
 *
 * {
     "title": "Amazing new feature",
     "body": "Please pull this in!",
     "head": "octocat:new-feature",
     "base": "master"
  }
 */
public class PullRequest
{
    public String title;
    public String body;
    public String head;
    public String base;

    public PullRequest(String title, String body, String head, String base) {
        this.title = title;
        this.body = body;
        this.head = head;
        this.base = base;
    }
}
