//package com.github.onsdigital.florence.api;
//
//import com.github.davidcarboni.ResourceUtils;
//import com.github.davidcarboni.restolino.framework.Home;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//public class HomePage implements Home {
//
//	@Override
//	public Object get(HttpServletRequest request, HttpServletResponse response) throws IOException {
//
//		// Ensures ResourceUtils gets the right classloader when running
//		// reloadable in development:
//		ResourceUtils.classLoaderClass = HomePage.class;
//
//		response.setCharacterEncoding("UTF8");
//		response.setContentType("text/html");
//
////		try (Reader index = ResourceUtils.getReader("/files/index.html")) {
////			IOUtils.copy(index, response.getWriter());
////		}
//
//        response.sendRedirect("/florence/index.html");
//
//		return null;
//	}
//
//}
