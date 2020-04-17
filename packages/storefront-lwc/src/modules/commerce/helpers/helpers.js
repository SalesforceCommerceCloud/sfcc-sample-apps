/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

/**
 * Helper function to dispatch error event
 * @param {*} error
 */
export function dispatchErrorEvent(_error) {
    let error;

    if (!(_error instanceof Error)) {
        error = new Error(getErrorMessage(_error));
        error.detail = _error;
    } else {
        error = _error;
    }

    const errorEvent = new CustomEvent('errorevent', {
        bubbles: true,
        composed: true,
        detail: { error },
    });
    this.dispatchEvent(errorEvent);
}

function getErrorMessage(error) {
    if (error.message) return error.message;
    if (Array.isArray(error) && error[0]) return getErrorMessage(error[0]);
    return JSON.stringify(error);
}
