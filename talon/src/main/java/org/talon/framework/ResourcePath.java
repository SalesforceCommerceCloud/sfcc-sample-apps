package org.talon.framework;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Arrays.asList;
import static org.apache.commons.lang3.StringUtils.split;

import java.util.ArrayList;
import java.util.List;

import org.talon.framework.ResourceDescriptor.Type;

/**
 * A resource path, identifies a specific version of a generated resource.
 * 
 * Holds everything needed to build the path i.e. a resource descriptor, compile
 * mode and UID.
 * 
 * @author nrobertdehault
 * @since 218
 */
public class ResourcePath {

    /**
     * Use a constant prefix for URL, we can make it configurable if needed
     */
    private static final String TALON_PREFIX = "talon";

    /**
     * Use a constant extension as we only have JavaScript resources
     */
    private static final String JS_EXTENSION = "js";

    /** 
     * The default UID used in path
     */
    private static final String DEFAULT_UID = "latest";

    private static final String PATH_SEPARATOR = "/";
    
    private static final String EXTENSION_SEPARATOR = ".";
    
    private final ResourceDescriptor descriptor;
    private final CompileMode mode;
    private final String uid;
    
    public ResourcePath(ResourceDescriptor descriptor, CompileMode mode, String uid) {
        this.descriptor = checkNotNull(descriptor, "descriptor");
        this.mode = checkNotNull(mode, "mode");
        this.uid = uid;
    }

    public ResourcePath(StaticResource staticResource, CompileMode mode) {
        this(staticResource.getDescriptor(), mode, staticResource.getUid(mode));
    }

    public ResourceDescriptor getDescriptor() {
        return descriptor;
    }
    
    public CompileMode getMode() {
        return mode;
    }
    
    public String getUid() {
        return uid;
    }

    /**
     * Returns the resource path as a string
     */
    @Override
    public String toString() {
        StringBuilder path = new StringBuilder(PATH_SEPARATOR)
                .append(TALON_PREFIX).append(PATH_SEPARATOR)
                .append(descriptor.getType().name().toLowerCase()).append(PATH_SEPARATOR)
                .append(uid != null ? uid : DEFAULT_UID).append(PATH_SEPARATOR)
                .append(mode.name()).append(PATH_SEPARATOR);
                
        if (descriptor.getLocale() != null) {
            path.append(descriptor.getLocale()).append(PATH_SEPARATOR);
        }
        
        path.append(descriptor.getName()).append(EXTENSION_SEPARATOR).append(JS_EXTENSION);
        
        return path.toString();
    }

    /**
     * Parse a resource path and returns the corresponding {@link ResourcePath}.
     * 
     * @throws PathSyntaxException
     *             if an error occurs parsing the path
     */
    public static ResourcePath fromString(String path) throws PathSyntaxException {
        try {
            if (!path.startsWith(PATH_SEPARATOR)) {
                throw new PathSyntaxException("Path does not start with " + PATH_SEPARATOR + ": " + path);
            }
     
            String[] pathAndExtension = split(path, EXTENSION_SEPARATOR);
            
            if (pathAndExtension.length == 1) {
                throw new PathSyntaxException("Path does not include an extension: " + path);
            } else if (!JS_EXTENSION.equals(pathAndExtension[1])) {
                throw new PathSyntaxException("Invalid extension: " + pathAndExtension[1]);
            }

            List<String> parts = new ArrayList<>(asList(split(pathAndExtension[0], PATH_SEPARATOR)));
            
            String prefix = parts.remove(0);
            if (!TALON_PREFIX.equals(prefix)) {
                throw new PathSyntaxException("Invalid prefix: " + prefix);
            }

            Type type = Type.valueOf(parts.remove(0).toUpperCase());
            
            String name = parts.remove(parts.size() - 1);
            
            String uid = parts.remove(0);
            
            if (DEFAULT_UID.equals(uid)) {
                uid = null;
            }
            
            CompileMode mode = CompileMode.valueOf(parts.remove(0));
            
            String locale = null;
            
            if (type == Type.VIEW) {
                locale = parts.remove(parts.size() - 1);
            }

            // At this point all the parts should have been consumed 
            // If not the path is invalid
            if (!parts.isEmpty()) {
                throw new PathSyntaxException("Invalid path: " + path);
            }
            
            return new ResourcePath(new ResourceDescriptor(type, name, locale), mode, uid);
        } catch (IllegalArgumentException | IndexOutOfBoundsException e) {
            throw new PathSyntaxException(e);
        }
    }

}
