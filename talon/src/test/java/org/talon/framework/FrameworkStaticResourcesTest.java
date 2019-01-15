package org.talon.framework;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.talon.framework.CompileMode;
import org.talon.framework.FrameworkStaticResources;
import org.talon.framework.StaticResource;
import org.talon.framework.TalonException;

public class FrameworkStaticResourcesTest {

    @Test
    public void returnsTalonResource() throws TalonException, IOException {
        List<StaticResource> resources = FrameworkStaticResources.get();
        assertEquals(1, resources.size());

        StaticResource resource = resources.get(0);
        assertEquals("framework://talon", resource.getDescriptor().toString());

        for (CompileMode mode : CompileMode.values()) {
            assertNotNull(resource.getUid(mode));
            assertTrue(IOUtils.toString(resource.getContent(mode)).length() > 0);
        }
    }
}
