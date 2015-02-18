package com.github.onsdigital.util;

import org.junit.Test;

import java.nio.file.FileSystems;

import static org.junit.Assert.assertEquals;

public class PathUtilTest
{
    private static final String basePath = "target/taxonomy";

    @Test
    public void shouldResolvePathFromUriPathWithData()
    {
        String uriPath = "/data/economy/";
        String expected = basePath + "/economy.json";
        String actual = PathUtil.getDataPath(uriPath, FileSystems.getDefault().getPath(basePath)).toString();
        assertEquals(expected, actual);
    }

    @Test
    public void shouldResolvePathFromUriPath()
    {
        String uriPath = "/economy/";
        String expected = basePath + "/economy.json";
        String actual = PathUtil.getDataPath(uriPath, FileSystems.getDefault().getPath(basePath)).toString();
        assertEquals(expected, actual);
    }
}
