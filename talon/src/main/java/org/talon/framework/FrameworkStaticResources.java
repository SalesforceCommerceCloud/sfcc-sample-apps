package org.talon.framework;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.util.stream.Collectors.toMap;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.concurrent.ConcurrentException;
import org.apache.commons.lang3.concurrent.LazyInitializer;
import org.springframework.core.io.Resource;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * Provides access to the Talon framework static resources i.e. talon.js
 * packages with the module. 
 * 
 * @author nrobertdehault
 * @since 218
 */
public class FrameworkStaticResources {

    private static final String PUBLIC_PATH = "public";

    private static final String RESOURCES_JSON_PATH = "resources.json";

    private static final Type JSON_TYPE = new TypeToken<Map<String, Map<String, String>>>(){}.getType();

    private static LazyInitializer<List<StaticResource>> frameworkResources = new LazyInitializer<List<StaticResource>>() {
        
        @Override
        protected List<StaticResource> initialize() throws ConcurrentException {
            try {
                return loadResources();
            } catch (IOException e) {
                throw new ConcurrentException(e);
            }
        }
    };
    
    /**
     * Get all the framework resources packaged with the module.
     * 
     * @throws TalonException
     *             if an error occurs retrieving the resources
     */
    public static List<StaticResource> get() throws TalonException {
        try {
            return frameworkResources.get();
        } catch (ConcurrentException e) {
            throw new TalonException("Failed to get framework resources", e);
        }
    }
    
    private static List<StaticResource> loadResources() throws IOException {
        // read framework resource descriptors and UIDs from resources.json
        Resource resourceJson = TalonResources.getFrameworkResource(RESOURCES_JSON_PATH);
        Map<String, Map<String, String>> resources = new Gson().fromJson(new InputStreamReader(resourceJson.getInputStream()), JSON_TYPE);
        
        // convert each resources.json entry to a StaticResource
        return resources.entrySet().stream().map(resourceEntry -> {
            ResourceDescriptor descriptor = ResourceDescriptor.fromString(resourceEntry.getKey());
            
            Map<CompileMode, String> uids = resourceEntry.getValue().entrySet().stream().collect(toMap(
                    uidEntry -> CompileMode.valueOf(uidEntry.getKey()), 
                    uidEntry -> uidEntry.getValue())); 
            
            return new FrameworkStaticResource(descriptor, uids);
        }).collect(toImmutableList());
    }
    
    /**
     * A static resource implementation reading framework resources content 
     * from the classpath. 
     * 
     * UIDs are provided by the consumer. 
     */
    private static class FrameworkStaticResource implements StaticResource {
        
        private final ResourceDescriptor descriptor;
        private final Map<CompileMode, String> uids;

        public FrameworkStaticResource(ResourceDescriptor descriptor, Map<CompileMode, String> uids) {
            this.descriptor = descriptor;
            this.uids = uids;
        }
        
        @Override
        public ResourceDescriptor getDescriptor() {
            return descriptor;
        }

        @Override
        public String getUid(CompileMode mode) {
            return uids.get(mode);
        }
        
        @Override
        public InputStream getContent(CompileMode mode) throws IOException {
            String uid = getUid(mode);
            String path = new ResourcePath(descriptor, mode, uid).toString();
            return TalonResources.getFrameworkResource(PUBLIC_PATH + path).getInputStream();
        }
    }
}
