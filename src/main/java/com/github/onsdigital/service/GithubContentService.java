package com.github.onsdigital.service;

import com.github.onsdigital.json.github.Merge;
import com.github.onsdigital.json.github.MergePullRequest;
import com.github.onsdigital.json.github.PullRequest;
import com.github.onsdigital.json.github.PullRequestResponse;
import com.google.gson.Gson;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.kohsuke.github.GHContent;
import org.kohsuke.github.GHRef;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;

import java.io.IOException;

public class GithubContentService {
    private static final String username = "carlhuk";
    private static final String pass = "temptemp1";

    private static final String contentRepositoryName = "nightingale";
    private static final String contentRepositoryOwner = "ONSDigital";

    private static final String host = "https://api.github.com";

    public static void main(String[] args) throws IOException, UnirestException {
        String path = "/myPath";
        String release = "MarchRelease";
        String content = "this is the new content!";

        submitContent(content, path, "This is the march release content", release, "owner");
        approveRelease(username, release);

        System.out.println("done...");
    }

    /**
     * The publisher has entered the content and submits it.
     *
     * @param content - The json to store
     * @param release - the release (/branch) the content belongs to
     * @param owner   - The owner (fork) the content belongs to. this does not necessarily mean the user. It could be an organisation.
     */
    public static void submitContent(
            String content,
            String path,
            String note,
            String release,
            String owner) throws IOException {

        GitHub github = GitHub.connectUsingPassword(username, pass);
        GHRepository repo = getRepository(github);
        createBranch(release, repo);

        // create a content branch? - based on the content name / type?
        submitContent(content, path, note, release, repo);
    }


    /**
     * When the release is approved it is merged from the release branch back into the master branch.
     * The fork is then merged back into the main fork (ONSDigital fork) via a pull request.
     *
     * @param release
     */
    public static void approveRelease(String owner, String release) throws UnirestException {

        mergeReleaseBranch(owner, release);
        int pullRequestNumber = createPullRequest(owner, release);
        mergePullRequest(release, pullRequestNumber);
        DeleteBranch(owner, release);
    }


    private static void submitContent(String content, String path, String note, String release, GHRepository repo) throws IOException {
        // commit the content to the branch
        path = "taxonomy" + path;

        try {
            GHContent repoContent = repo.getFileContent(path + "/data.json", release);
            repoContent.update(content, note, release);
        } catch (IOException exception) {
            repo.createContent(content, note, path + "/data.json", release);
        }
    }

    private static void createBranch(String release, GHRepository repo) throws IOException {
        // create branch for the release if there isn't one
        GHRef ref;
        try {
            ref = repo.getRef("heads/" + release);
        } catch (IOException exception) {
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
        } catch (IOException exception) {
            repo = github.getRepository(contentRepositoryOwner + "/" + contentRepositoryName)
                    .fork();
        }
        return repo;
    }

    private static void DeleteBranch(String owner, String release) throws UnirestException {
        //DELETE /repos/octocat/Hello-World/git/refs/heads/feature-a
        HttpResponse<String> deleteBranchResponse = Unirest.delete(
                host + "/repos/" + owner + "/" + contentRepositoryName + "/git/refs/heads/" + release)
                .header("accept", "application/json")
                .basicAuth(username, pass)
                .asString();
    }

    private static void mergePullRequest(String release, int pullRequestNumber) throws UnirestException {
        ///repos/:owner/:repo/pulls/:number/merge
        Gson gson = new Gson();
        String mergePullRequest = gson.toJson(new MergePullRequest(release + " pull request"));

        HttpResponse<String> mergePullRequestResponse = Unirest.put(
                host + "/repos/" + contentRepositoryOwner + "/" + contentRepositoryName + "/pulls/" + pullRequestNumber + "/merge")
                .basicAuth(username, pass)
                .body(mergePullRequest)
                .asString();

        System.out.println("Merge pull request..." + mergePullRequestResponse.getBody());
    }

    private static int createPullRequest(String owner, String release) throws UnirestException {
        // Create pull request
        Gson gson = new Gson();
        String pullRequest = gson.toJson(new PullRequest(release + " pull request", "message", owner + ":master", "master"));

        HttpResponse<String> pullRequestResponse = Unirest.post(host + "/repos/" + contentRepositoryOwner + "/" + contentRepositoryName + "/pulls")
                .header("accept", "application/json")
                .basicAuth(username, pass)
                .body(pullRequest)
                .asString();

        int pullRequestNumber = gson.fromJson(pullRequestResponse.getBody(), PullRequestResponse.class).number;

        System.out.println("Create pull request..." + pullRequestResponse.getBody());
        return pullRequestNumber;
    }

    private static void mergeReleaseBranch(String owner, String release) throws UnirestException {
        Gson gson = new Gson();
        String json = gson.toJson(new Merge("master", release, owner + " merged " + release + " into master"));

        HttpResponse<String> mergeResponse = Unirest.post(host + "/repos/" + owner + "/" + contentRepositoryName + "/merges")
                .header("accept", "application/json")
                .basicAuth(username, pass)
                .body(json)
                .asString();

        System.out.println("Merge release branch into master..." + mergeResponse.getBody());
    }
}
