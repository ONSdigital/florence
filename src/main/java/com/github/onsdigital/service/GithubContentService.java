package com.github.onsdigital.service;

import com.github.onsdigital.json.DataItem;
import org.kohsuke.github.GHContent;
import org.kohsuke.github.GHRef;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;

import java.io.IOException;

public class GithubContentService
{
    private static final String username = "";
    private static final String pass = "";

    private static final String contentRepositoryName = "nightingale";
    private static final String contentRepositoryOwner = "ONSDigital";


    public static void main(String[] args) throws IOException
    {
        String path = "taxonomy/myPath";
        String release = "myRelease";
        String content = "some other Content";

        submitContent(content, path, "my commit note", release, "owner");

        GitHub github = GitHub.connectUsingPassword(username, pass);
        GHRepository repo = github.getRepository(username + "/" + contentRepositoryName);

        GHContent repoContent = repo.getFileContent(path + "/data.json", release);
        String contentJson = repoContent.getContent();

        System.out.println("done..." + contentJson);
    }

    /**
     * The publisher has entered the content and submits it.
     * @param content - The json to store
     * @param release - the release (/branch) the content belongs to
     * @param owner - The owner (fork) the content belongs to. this does not necessarily mean the user. It could be an organisation.
     */
    public static void submitContent(
            String content,
            String path,
            String note,
            String release,
            String owner) throws IOException
    {
        GitHub github = GitHub.connectUsingPassword(username, pass);
        GHRepository repo = getRepository(github);
        createBranch(release, repo);

        // create a content branch? - based on the content name / type?

        submitContent(content, path, note, release, repo);
    }

    private static void submitContent(String content, String path, String note, String release, GHRepository repo) throws IOException {
        // commit the content to the branch
        try {
            GHContent repoContent = repo.getFileContent(path + "/data.json", release);
            repoContent.update(content, note, release);
        }
        catch (IOException exception)
        {
            repo.createContent(content, note, path + "/data.json", release);
        }
    }

    private static void createBranch(String release, GHRepository repo) throws IOException {
        // create branch for the release if there isn't one
        GHRef ref;
        try {
            ref = repo.getRef("heads/" + release);
        }
        catch (IOException exception)
        {
            String masterRefSha = repo.getRef("heads/master").getObject().getSha();
            repo.createRef("refs/heads/" + release, masterRefSha);
        }
    }

    private static GHRepository getRepository(GitHub github) throws IOException {
        // create fork if there isn't one
        // currently creating the fork for the user. The forks will have to be created up front for organisations
        // to allow the user to access.
        GHRepository repo;
        try {
            repo = github.getRepository(username + "/" + contentRepositoryName);
        }
        catch (IOException exception)
        {
            repo = github.getRepository(contentRepositoryOwner + "/" + contentRepositoryName)
                    .fork();
        }
        return repo;
    }

    /**
     * The content owner has reviewed the content and approves it.
     * @param content
     * @param release
     */
    public static void approveContent(DataItem content, String release)
    {
        // merge the content item branch back into release branch
    }

    /**
     * Not sure if we need this yet
     * @param release
     */
    public static void approveRelease(String release)
    {
        // merge the release branch back into fork master
    }

    public static void getContent(String path, String release, String owner)
    {
        // read content from the owners fork, in the release branch
    }



}
