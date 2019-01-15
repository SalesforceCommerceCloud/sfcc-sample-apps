package org.talon.framework;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

/**
 * Provides access to the classpath resources packages with the Talon module. 
 * 
 * 
 * 
 * @author nrobertdehault
 * @since 218
 */
public class TalonResources {

    private static final String PARENT_PATH = "/org/talon/resources/";
    
    private static final String FRAMEWORK_RESOURCES_PATH = "framework";

    private static final String COMPILER_RESOURCES_PATH = "compiler";

    private static final String TEMPLATES_RESOURCES_PATH = "template";

    /*
     * Cache for classpath resources
     */
    private static LoadingCache<String, Resource> classPathResourcesCache = CacheBuilder.newBuilder()
            .build(new CacheLoader<String, Resource>() {
                @Override
                public Resource load(String path) throws Exception {
                    return new ClassPathResource(PARENT_PATH + path);
                };
            });

    /**
     * Get the framework classpath resource with the given path
     * relative to whatever framework resources package.  
     */
    public static Resource getFrameworkResource(String path) {
        return classPathResourcesCache.getUnchecked(FRAMEWORK_RESOURCES_PATH + "/" + path);
    }

    /**
     * Get the compiler classpath resource with the given path
     * relative to whatever compiler resources package.  
     */
    public static Resource getCompilerResource(String path) {
        return classPathResourcesCache.getUnchecked(COMPILER_RESOURCES_PATH + "/" + path);
    }

    public static Resource getTemplateResource(String templateDevName, String path) {
        return classPathResourcesCache.getUnchecked(TEMPLATES_RESOURCES_PATH + "/" + templateDevName +  "/" + path);
    }

}
