package org.talon.framework;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;

import org.junit.Test;
import org.talon.framework.ResourceDescriptor.Type;

public class ResourcePathTest {

    @Test
    public void createsResourcePath() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        CompileMode mode = CompileMode.dev;
        String uid = "uid";
        
        ResourcePath path = new ResourcePath(descriptor, mode, uid);
        
        assertSame(descriptor, path.getDescriptor());
        assertSame(mode, path.getMode());
        assertSame(uid, path.getUid());
    }

    @Test
    public void createsResourcePathWithNullUid() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        CompileMode mode = CompileMode.dev;
        String uid = null;
        
        ResourcePath path = new ResourcePath(descriptor, mode, uid);
        
        assertSame(descriptor, path.getDescriptor());
        assertSame(mode, path.getMode());
        assertSame(uid, path.getUid());
    }

    @Test(expected = NullPointerException.class)
    public void throwsWhenCreatingResourcePathWithNullDescriptor() {
        new ResourcePath(null, CompileMode.dev, null);
    }
    
    @Test(expected = NullPointerException.class)
    public void throwsWhenCreatingResourcePathWithNullMode() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        
        new ResourcePath(descriptor, null, null);
    }
    
    @Test
    public void returnsPath() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.FRAMEWORK, "name", null);
        CompileMode mode = CompileMode.dev;
        String uid = "uid";
        
        String path = new ResourcePath(descriptor, mode, uid).toString();

        assertEquals("/talon/framework/uid/dev/name.js", path);
    }
    
    @Test
    public void returnsPathWithDefaultUid() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.FRAMEWORK, "name", null);
        CompileMode mode = CompileMode.dev;
        String uid = null;
        
        String path = new ResourcePath(descriptor, mode, uid).toString();

        assertEquals("/talon/framework/latest/dev/name.js", path);
    }
    
    @Test
    public void returnsPathWithLocale() {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        CompileMode mode = CompileMode.dev;
        String uid = "uid";
        
        String path = new ResourcePath(descriptor, mode, uid).toString();

        assertEquals("/talon/view/uid/dev/locale/name.js", path);
    }
    
    @Test
    public void parsesViewPath() throws PathSyntaxException {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        CompileMode mode = CompileMode.dev;
        String uid = "uid";
        
        ResourcePath path = ResourcePath.fromString("/talon/view/uid/dev/locale/name.js");
        
        assertEquals(descriptor, path.getDescriptor());
        assertSame(mode, path.getMode());
        assertEquals(uid, path.getUid());
    }
    
    @Test
    public void parsesViewPathWithoutUid() throws PathSyntaxException {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.VIEW, "name", "locale");
        CompileMode mode = CompileMode.dev;
        String uid = null;
        
        ResourcePath path = ResourcePath.fromString("/talon/view/latest/dev/locale/name.js");
        
        assertEquals(descriptor, path.getDescriptor());
        assertSame(mode, path.getMode());
        assertEquals(uid, path.getUid());
    }
    
    @Test
    public void parsesFrameworkPath() throws PathSyntaxException {
        ResourceDescriptor descriptor = new ResourceDescriptor(Type.FRAMEWORK, "name", null);
        CompileMode mode = CompileMode.dev;
        String uid = "uid";
        
        ResourcePath path = ResourcePath.fromString("/talon/framework/uid/dev/name.js");
        
        assertEquals(descriptor, path.getDescriptor());
        assertSame(mode, path.getMode());
        assertEquals(uid, path.getUid());
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingInvalidPath() throws PathSyntaxException {
        ResourcePath.fromString("/talon/framework/913d24b777/dev/invalid/talon.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathNotStartingWithSlash() throws PathSyntaxException {
        ResourcePath.fromString("talon/component/f13235e170/prod/en_US/community_flashhelp/home.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithInvalidPrefix() throws PathSyntaxException {
        ResourcePath.fromString("/unknown/component/f13235e170/prod/en_US/community_flashhelp/home.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithInvalidExtension() throws PathSyntaxException {
        ResourcePath.fromString("/talon/component/f13235e170/prod/en_US/community_flashhelp/home.json");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithInvalidMode() throws PathSyntaxException {
        ResourcePath.fromString("/talon/component/f13235e170/test/en_US/community_flashhelp/home.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithInvalidType() throws PathSyntaxException {
        ResourcePath.fromString("/talon/invalidType/uid/dev/name.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithoutMode() throws PathSyntaxException {
        ResourcePath.fromString("/talon/framework/latest/talon.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingPathWithoutUid() throws PathSyntaxException {
        ResourcePath.fromString("/talon/framework/talon.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingComponentPathWithoutLocale() throws PathSyntaxException {
        ResourcePath.fromString("/talon/component/f13235e170/prod/community_flashhelp/home.js");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingComponentPathWithoutExtension() throws PathSyntaxException {
        ResourcePath.fromString("/talon/framework/uid/dev/name");
    }
    
    @Test(expected = PathSyntaxException.class)
    public void throwsWhenParsingZachsPath() throws PathSyntaxException {
        ResourcePath.fromString("/talon/somethingThatShouldNotBeThere/uid/dev/name.js");
    }
}