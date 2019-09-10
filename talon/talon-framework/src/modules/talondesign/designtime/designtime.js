import { initializeInteractions } from './interactions';

function start(window) {
    // This file will define all the Talon specific configurations
    // for interactions and initialize interactions library
    initializeInteractions(window);
}

start(window);

export default { start };