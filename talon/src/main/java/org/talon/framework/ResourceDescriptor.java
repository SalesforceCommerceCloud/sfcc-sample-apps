package org.talon.framework;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;

import org.apache.commons.lang3.StringUtils;

/**
 * Descriptor, or logical name, for a resource. 
 * 
 * Includes a type, name, and locale if applicable. 
 * 
 * Name must be unique for a given type. 
 * 
 * For now only component resources support and require a locale. 
 * 
 * Descriptor format as a string is {@code <type>://<name>[@<locale>]}. 
 * 
 * @author nrobertdehault
 * @since 218
 */
public class ResourceDescriptor {

    /**
     * Available resource types
     */
    public static enum Type { VIEW, FRAMEWORK }
    
    private static final String TYPE_NAME_SEPARATOR = "://";
    
    private static final String NAME_LOCALE_SEPARATOR = "@";
    
    private final Type type;
    private final String name;
    private final String locale;
    
    public ResourceDescriptor(Type type, String name) {
        this(type, name, null);
    }

    public ResourceDescriptor(Type type, String name, String locale) {
        this.type = checkNotNull(type, "type");
        this.name = checkNotNull(name, "name");
        this.locale = locale;
        checkArgument(!(locale == null && type == Type.VIEW), "%s resource descriptor must include a locale", type);
        checkArgument(!(locale != null && type != Type.VIEW), "%s resource descriptor cannot include a locale", type);
    }

    public Type getType() {
        return this.type;
    }

    public String getName() {
        return this.name;
    }

    public String getLocale() {
        return this.locale;
    }

    /**
     * Returns a string representation of this resource descriptor. 
     * 
     * The returned string format is {@code <type>://<name>[@<locale>]}. 
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder(type.name().toLowerCase())
                .append(TYPE_NAME_SEPARATOR).append(name);
        
        if (locale != null) {
            sb.append(NAME_LOCALE_SEPARATOR).append(locale);
        }
        
        return sb.toString(); 
    }
    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.locale == null) ? 0 : this.locale.hashCode());
        result = prime * result + ((this.name == null) ? 0 : this.name.hashCode());
        result = prime * result + ((this.type == null) ? 0 : this.type.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        ResourceDescriptor other = (ResourceDescriptor)obj;
        if (this.locale == null) {
            if (other.locale != null) return false;
        } else if (!this.locale.equals(other.locale)) return false;
        if (this.name == null) {
            if (other.name != null) return false;
        } else if (!this.name.equals(other.name)) return false;
        if (this.type == null) {
            if (other.type != null) return false;
        } else if (!this.type.equals(other.type)) return false;
        return true;
    }

    /**
     * Parse the given string as a descriptor.
     * 
     * The expected format is {@code <type>://<name>[@<locale>]}
     * 
     * @param str
     *            the string to parse
     * @return the parsed string as a {@link ResourceDescriptor}
     */
    public static ResourceDescriptor fromString(String str) {
        String[] typeNameSplitStr = StringUtils.splitByWholeSeparator(str, TYPE_NAME_SEPARATOR, 2);        
        String[] nameLocaleSplitStr = StringUtils.splitByWholeSeparator(typeNameSplitStr[1], NAME_LOCALE_SEPARATOR, 2);        
        
        Type type = Type.valueOf(typeNameSplitStr[0].toUpperCase());
        String name = nameLocaleSplitStr[0];
        String locale = nameLocaleSplitStr.length == 2 ? nameLocaleSplitStr[1] : null;
        
        return new ResourceDescriptor(type, name, locale);
    }

    /**
     * Create a view {@link ResourceDescriptor} with the given name and locale.
     */
    public static ResourceDescriptor view(String name, String locale) {
        return new ResourceDescriptor(Type.VIEW, name, locale);
    }
}
