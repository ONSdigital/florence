import com.github.davidcarboni.restolino.framework.Api;
import org.apache.commons.io.FileUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

/**
 * Created by carl on 17/02/15.
 */
@Api
public class Cats {

    @GET
    public List<String> cats(HttpServletRequest request, HttpServletResponse response)
    {
        return Arrays.asList(new String[] { "meow here ", "meow there"});
    }

    @POST
    public void cats(HttpServletRequest request, HttpServletResponse response, Content content) throws IOException {
        System.out.println(content.json);

        FileUtils.writeStringToFile(new File("./blah"), content.json, Charset.forName("utf8"));

    }
}
