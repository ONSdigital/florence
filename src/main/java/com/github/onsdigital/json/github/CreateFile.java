package com.github.onsdigital.json.github;

/**
 * PUT /repos/:owner/:repo/contents/:path
 *
 * {
    "message": "my commit message",
    "committer": {
    "name": "Scott Chacon",
    "email": "schacon@gmail.com"
    },
 "content": "bXkgbmV3IGZpbGUgY29udGVudHM="
 }
 */
public class CreateFile
{
    public String path;
    public String message;
    public String content;
    public String branch;

    public CreateFile(String path, String message, String content, String branch) {
        this.path = path;
        this.message = message;
        this.content = content;
        this.branch = branch;
    }
}


