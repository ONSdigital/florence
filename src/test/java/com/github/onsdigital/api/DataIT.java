package com.github.onsdigital.api;

import com.jayway.restassured.response.Response;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

import static com.jayway.restassured.RestAssured.get;
import static com.jayway.restassured.path.json.JsonPath.from;

public class DataIT
{
    @Test
    public void shouldReturnMeows()
    {
        Response response = get("http://localhost:8081/data");
        response.then().assertThat().statusCode(200);

        List<String> values = from(response.asString()).get();

        Assert.assertEquals("meow here ", values.get(0));
        Assert.assertEquals("meow there", values.get(1));
    }
}
