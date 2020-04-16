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
export function dispatchErrorEvent(error) {
    const errorEvent = new CustomEvent('errorevent', {
        bubbles: true,
        composed: true,
        detail: { error },
    });
    this.dispatchEvent(errorEvent);
}
