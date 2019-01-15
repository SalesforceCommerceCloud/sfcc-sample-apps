package org.talon.framework;

import java.io.IOException;
import java.io.InputStream;

/**
 * A (JavaScript) static resource, identified by a {@link ResourceDescriptor},
 * including UID and content for all {@link CompileMode}.
 * 
 * @author nrobertdehault
 * @since 218
 */
public interface StaticResource {

    /**
     * Get the reource descriptor
     */
    public ResourceDescriptor getDescriptor();

    /**
     * Get the content UID for the specified {@link CompileMode}.
     */
    public String getUid(CompileMode mode);

    /**
     * Get the content for the specified {@link CompileMode}.
     * 
     * @throws IOException
     *             if an error occurs while retrieving the content
     */
    public InputStream getContent(CompileMode mode) throws IOException;
}
