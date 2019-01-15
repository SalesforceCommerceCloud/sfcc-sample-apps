package org.talon.framework;

import org.talon.framework.ResourceDescriptor.Type;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;

import org.junit.Test;

public class ResourceDescriptorTest {

    @Test(expected = NullPointerException.class)
    public void requiresType() {
        new ResourceDescriptor(null, "name", null);
    }

    @Test(expected = NullPointerException.class)
    public void requiresName() {
        new ResourceDescriptor(Type.FRAMEWORK, null, null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void requiresLocaleForComponent() {
        new ResourceDescriptor(Type.VIEW, "name", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void onlyAllowsLocaleForComponent() {
        new ResourceDescriptor(Type.FRAMEWORK, "name", "locale");
    }
    
    @Test
    public void createsResourceDescriptorEqual() {
        assertEquals(new ResourceDescriptor(Type.FRAMEWORK, "name"), new ResourceDescriptor(Type.FRAMEWORK, "name"));
        assertEquals(new ResourceDescriptor(Type.FRAMEWORK, "name").hashCode(), new ResourceDescriptor(Type.FRAMEWORK, "name").hashCode());
        assertNotEquals(new ResourceDescriptor(Type.FRAMEWORK, "name"), new ResourceDescriptor(Type.FRAMEWORK, "otherName"));
        assertEquals(new ResourceDescriptor(Type.VIEW, "name", "locale"), new ResourceDescriptor(Type.VIEW, "name", "locale"));
        assertEquals(new ResourceDescriptor(Type.VIEW, "name", "locale").hashCode(), new ResourceDescriptor(Type.VIEW, "name", "locale").hashCode());
        assertNotEquals(new ResourceDescriptor(Type.VIEW, "name", "locale"), new ResourceDescriptor(Type.VIEW, "otherName", "locale"));
        assertNotEquals(new ResourceDescriptor(Type.VIEW, "name", "locale"), new ResourceDescriptor(Type.VIEW, "name", "otherLocale"));
        assertNotEquals(new ResourceDescriptor(Type.VIEW, "name", "locale"), new ResourceDescriptor(Type.FRAMEWORK, "name"));
    }
    
    @Test
    public void createsFrameworkDescriptor() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.FRAMEWORK, "name", null);
        
        assertSame(Type.FRAMEWORK, descriptor.getType());
        assertEquals("name", descriptor.getName());
        assertNull(descriptor.getLocale());
    }
    
    @Test
    public void createsViewDescriptor() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        
        assertSame(Type.VIEW, descriptor.getType());
        assertEquals("name", descriptor.getName());
        assertEquals("locale", descriptor.getLocale());
    }
    
    @Test
    public void createsComponentDescriptorUsingFactoryMethod() {
        ResourceDescriptor descriptor = ResourceDescriptor.view("name", "locale");
        
        assertSame(Type.VIEW, descriptor.getType());
        assertEquals("name", descriptor.getName());
        assertEquals("locale", descriptor.getLocale());
    }
    
    @Test
    public void parsesFrameworkDescriptor() {
        ResourceDescriptor descriptor = ResourceDescriptor.fromString("framework://name");
        
        assertSame(Type.FRAMEWORK, descriptor.getType());
        assertEquals("name", descriptor.getName());
        assertNull(descriptor.getLocale());
    }
    
    @Test
    public void parsesViewDescriptor() {
        ResourceDescriptor descriptor = ResourceDescriptor.fromString("view://name@locale");
        
        assertSame(Type.VIEW, descriptor.getType());
        assertEquals("name", descriptor.getName());
        assertEquals("locale", descriptor.getLocale());
    }
    
}
