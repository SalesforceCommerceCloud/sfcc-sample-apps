/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

package org.talon.resources.compiler;

import static org.junit.Assert.assertEquals;

import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestName;
import org.talon.test.GoldFile;

import com.github.jknack.handlebars.*;
import com.github.jknack.handlebars.io.StringTemplateSource;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * Handlebars template related tests.
 *
 * @author nrobertdehault
 * @since 218
 */
public class HandlebarsTemplateTest {

    @Rule public TestName testName = new TestName();

    private static String HANDLEBARS_HELPERS_PATH = "/org/talon/resources/compiler/handlebars-helpers.js";

    private static String INDEX_PATH = "/org/talon/resources/template/raptortemplate/index.html";

    private static String ROUTES_PATH = "/org/talon/resources/template/raptortemplate/routes.json";

    private static String BRANDING_PATH = "/org/talon/resources/template/raptortemplate/branding.json";

    private static String THEME_PATH = "/org/talon/resources/template/raptortemplate/theme.json";

    private static final String[] MODES = {"dev", "prod" /*, "compat", "prod_compat" */ };  
    
    /**
     * Compile the HTML template and apply it for all routes and modes. 
     * 
     * This include registering the JavaScript helpers which will be
     * executed in Rhino. 
     */
    @Test
    public void testApplyTemplate() throws Exception {
        Handlebars handlebars = new Handlebars();
         
        // register JavaScript helpers
        handlebars.registerHelpers(FilenameUtils.getName(HANDLEBARS_HELPERS_PATH), getClass().getResourceAsStream(HANDLEBARS_HELPERS_PATH));

        // compile template
        String html = IOUtils.toString(getClass().getResourceAsStream(INDEX_PATH));
        Template htmlTemplate = handlebars.compile(new StringTemplateSource(FilenameUtils.getName(INDEX_PATH), html));

        // load metadata
        Type arrayType = new TypeToken<Map<String, Object>[]>(){}.getType();
        Type objectType = new TypeToken<Map<String, Object>>(){}.getType();
        
        Map<String, Object>[] routes = new Gson().fromJson(new InputStreamReader(getClass().getResourceAsStream(ROUTES_PATH)), arrayType);
        Map<String, Object>[] brandingProperties = new Gson().fromJson(new InputStreamReader(getClass().getResourceAsStream(BRANDING_PATH)), arrayType);
        Map<String, Object> theme = new Gson().fromJson(new InputStreamReader(getClass().getResourceAsStream(THEME_PATH)), objectType);
        Map<String, String> viewToThemeLayoutMap = new HashMap<>();
        viewToThemeLayoutMap.put("home","heroLayout");
        viewToThemeLayoutMap.put("about", "headerAndFooter");
        viewToThemeLayoutMap.put("faq","headerAndFooter");
        viewToThemeLayoutMap.put("error", "headerAndFooter");
        viewToThemeLayoutMap.put("confirmation", "headerAndFooter");
        viewToThemeLayoutMap.put("customPerf", "headerAndFooter");
        viewToThemeLayoutMap.put("login", "fullLayout");

        assertEquals("Mocked view to theme layout map does not match routes length", routes.length, viewToThemeLayoutMap.size());

		Map<String, String> resources = new HashMap<>();
        String versionKey = "123";
        String locale = "fr";
        
        for (Map<String, Object> route : routes) {
            for (String mode : MODES) {
                // build context
                Map<String, Object> talonContext = ImmutableMap.<String, Object>builder()
                        .put("theme", theme)
                        .put("brandingProperties", brandingProperties)
                        .put("routes", routes)
                        .put("currentRoute", route)
                        .put("mode", mode)
                        .put("basePath", "/base")      
                        .put("resources", resources)
                        .put("locale", locale)
                        .put("viewToThemeLayoutMap", viewToThemeLayoutMap)
                        .build();
                
                Map<String, Object> model = ImmutableMap.<String, Object>builder()
                        .put("context", talonContext)
                        .put("basePath", "/base")                        
                        .put("versionKey", versionKey)                        
                        .build();
                
                Context context = Context.newBuilder(model).build();
                
                // apply template
                String out = htmlTemplate.apply(context);
                
                // write gold file, this will fail if the gold file exists and is different
                GoldFile.write(getClass().getSimpleName(), testName.getMethodName() + "_" + route.get("name") +  "_" + mode + ".html", out);
            }
        }
    }
}
