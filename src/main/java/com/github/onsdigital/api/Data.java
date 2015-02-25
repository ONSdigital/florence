package com.github.onsdigital.api;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.io.FileUtils;

import com.github.davidcarboni.restolino.framework.Api;
import com.github.onsdigital.json.Content;
import com.github.onsdigital.util.PathUtil;

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
		Path path = PathUtil.fromUri(content.id);
		System.out.println("saving to path: " + path.toString());
		FileUtils.writeStringToFile(path.toFile(), content.json,
				Charset.forName("utf8"));
        Runtime.getRuntime().exec("git add . && git commit -m 'foo' && git push ");

	}
}
