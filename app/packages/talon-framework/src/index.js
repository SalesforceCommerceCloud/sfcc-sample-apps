import { assert as talonAssert } from 'talon/utils';
import { register } from 'lwc';
import * as configProvider from 'talon/configProvider';
import * as intlLibrary from 'talon/intlLibrary';
import * as talonAura from 'talon/aura';
import * as wireService from '@lwc/wire-service';
import App from 'talon/app';
import auraInstrumentation from 'talon/auraInstrumentation';
import auraStorage from 'talon/auraStorage';
import brandingService from 'talon/brandingService';
import componentService from 'talon/componentService';
import moduleRegistry from 'talon/moduleRegistry';
import RouterContainer from 'talon/routerContainer';
import RouterLink from 'talon/routerLink';
import routingService from 'talon/routingService';
import talonLogger from 'talon/logger';
import themeService from 'talon/themeService';

// Register compat modules
if (process.env.LWC_TARGET === 'es5' && self.TalonCompat && self.TalonCompat.modules) {
    moduleRegistry.addModules(self.TalonCompat.modules);
}

/*
 * Register framework modules
 */
moduleRegistry.addModules({
    'assert': talonAssert,
    'aura-instrumentation': auraInstrumentation,
    'aura-storage': auraStorage,
    'aura': talonAura,
    'talon/app': App,
    'talon/configProvider': configProvider,
    'talon/routerContainer': RouterContainer,
    'talon/routerLink': RouterLink,
    'talon/routingService': routingService,
    'talon/componentService': componentService,
    'instrumentation/service': auraInstrumentation,
    'lightning:IntlLibrary': intlLibrary,
    'lightning/configProvider': configProvider,
    'logger': talonLogger,
    'wire-service': wireService,
});

/*
 * Register wire service
 */
wireService.registerWireService(register);

/*
 * Set 3rd party router implementation
 */
import page from 'page/index.js'; // load index.js directly because page.mjs inlines its dependencies (path-to-regexp) ending up in code duplication
routingService.setRouter(page.default);

/*
 * Export services accessible globally e.g. Talon.componentService, etc...
 */
export default { componentService, routingService, themeService, brandingService, configProvider, moduleRegistry };
