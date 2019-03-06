import { assert as talonAssert } from 'talon/utils';
import { register } from 'lwc';
import * as intlLibrary from 'talon/intlLibrary';
import * as talonAura from 'talon/aura';
import * as wireService from 'lwc-wire-service';
import App from 'talon/app';
import auraInstrumentation from 'talon/auraInstrumentation';
import auraStorage from 'talon/auraStorage';
import brandingService from 'talon/brandingService';
import componentService from 'talon/componentService';
import configProvider from 'talon/configProvider';
import moduleRegistry from 'talon/moduleRegistry';
import RouterContainer from 'talon/routerContainer';
import RouterLink from 'talon/routerLink';
import routingService from 'talon/routingService';
import talonLogger from 'talon/logger';
import themeService from 'talon/themeService';

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
import * as page from 'page';
routingService.setRouter(page.default);

/*
 * Export services accessible globally e.g. Talon.componentService, etc...
 */
export default { componentService, routingService, themeService, brandingService, configProvider, moduleRegistry };
