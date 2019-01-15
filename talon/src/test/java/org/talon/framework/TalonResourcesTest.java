package org.talon.framework;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class TalonResourcesTest {

    @Test
    public void returnsFrameworkResourcesJson() {
        assertTrue(TalonResources.getFrameworkResource("resources.json").exists());
    }

    @Test
    public void returnsCompilerResourcesIndexHtml() {
        assertTrue(TalonResources.getCompilerResource("handlebars-helpers.js").exists());
    }

    @Test
    public void returnsTemplateResourcesIndexHtml() {
        assertTrue(TalonResources.getTemplateResource("raptortemplate", "index.html").exists());
    }
}
