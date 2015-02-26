package com.github.onsdigital.service;

import com.github.onsdigital.json.DataItem;

public class GithubContentService
{
    /**
     * The publisher has entered the content and submits it.
     * @param content
     * @param release
     * @param owner
     */
    public void createContent(DataItem content, String release, String owner)
    {
        // create fork if there isn't one

        // create branch for the release if there isn't one

        // create a content branch - based on the content name / type?

        // commit the content to the branch
    }

    /**
     * The content owner has reviewed the content and approves it.
     * @param content
     * @param release
     */
    public void approveContent(DataItem content, String release)
    {
        // merge the content item branch back into release branch
    }

    /**
     * Not sure if we need this yet
     * @param release
     */
    public void approveRelease(String release)
    {
        // merge the release branch back into fork master
    }

    public void getContent(String path, String release, String owner)
    {
        // read content from the owners fork, in the release branch
    }



}
