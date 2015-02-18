package com.github.onsdigital.api;

import com.github.davidcarboni.restolino.framework.Filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CrossOriginFilter implements Filter
{
    /**
     * This filter adds required headers to the Http response allowing cross origin calls.
     * There is no configuration to enable this filter, it is recognised automatically at run time.
     * @param request
     * @param response
     * @return
     */
    @Override
    public boolean filter(HttpServletRequest request, HttpServletResponse response) {

        System.out.println("CrossOriginFilter");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return true;
    }
}
