import { hasModule, getModuleIfPresent as getModule } from 'talon/moduleRegistry';
import executeGlobalController from 'talon/apiCall';
import { log } from "talon/logger";

function createComponent(name, attributes) {
    log(`[aura] createComponent(${JSON.stringify({ name, attributes })})`);
}

export { executeGlobalController, hasModule, getModule, createComponent };
