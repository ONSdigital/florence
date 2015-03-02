package com.github.onsdigital.json.github;

/**
 * Used to request a merge on the github API.
 *
 * POST /repos/:owner/:repo/merges
 *
 * {
 "base": "master",
 "head": "cool_feature",
 "commit_message": "Shipped cool_feature!"
 }
 */
public class Merge
{
    public String base;
    public String head;
    public String commit_message;

    public Merge(String base, String head, String commit_message) {
        this.base = base;
        this.head = head;
        this.commit_message = commit_message;
    }
}
