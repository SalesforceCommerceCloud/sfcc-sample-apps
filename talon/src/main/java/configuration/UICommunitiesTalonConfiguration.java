package configuration;

import java.io.File;
import java.util.logging.Logger;

import org.auraframework.adapter.ComponentLocationAdapter;
import org.auraframework.def.DefDescriptor;
import org.springframework.context.annotation.Bean;

public class UICommunitiesTalonConfiguration {

    private static final Logger log = Logger.getLogger(UICommunitiesTalonConfiguration.class.getName());

    /**
     * The runtime-determined root folder from which the module is being executed.
     * 
     * The call to getPath() will provide a folder location akin to /Users/person/ui-communities-talon/target/classes,
     * so we take the folder two parents up.
     */
    private static final File moduleRootFolder = new File(
        UICommunitiesTalonConfiguration.class.getProtectionDomain().getCodeSource().getLocation().getPath())
                    .getParentFile()
                    .getParentFile();

    /**
     * ComponentLocationAdapter for the talon-framework package
     */
    @Bean
    public ComponentLocationAdapter talonFrameworkModuleLocationAdapter() {
        return new CommunitiesTalonModulesLocator("ui-communities-talon-framework-modules", "packages/talon-framework/src/modules");
    }

    /**
     * ComponentLocationAdapter for the talon-template-flashhelp package
     */
    @Bean
    public ComponentLocationAdapter talonTemplateFlashHelpModuleLocationAdapter() {
        return new CommunitiesTalonModulesLocator("ui-communities-talon-template-flashhelp-modules", "packages/talon-template-flashhelp/src/modules");
    }

    /**
     * Gets a module-relative folder given a path.
     * 
     * @param   moduleRelativePath  A path, relative to the module root.
     * 
     * @return  A handle to the folder at the specified module-relative location.
     */
    private static File getModuleFolder(String moduleRelativePath) {
        return new File(moduleRootFolder, moduleRelativePath);
    }

    private class CommunitiesTalonModulesLocator extends ComponentLocationAdapter.Impl {

        public CommunitiesTalonModulesLocator(String sourcePackage, String moduleFolderRelativePath) {
            super(null, null, getModuleFolder(moduleFolderRelativePath), sourcePackage);
            log.info("Registered " + sourcePackage + " modules with source folder " + getComponentSourceDir());
        }
    }
}
