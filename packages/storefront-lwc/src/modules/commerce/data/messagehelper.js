/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * @param obj: set value of attribute in this obj
 * @param ms: time to wait for
 */
export const messagehelper = {
    setMessageTimeout: (obj, ms) => {
        setTimeout(() => {
            // eslint-disable-next-line no-param-reassign
            obj.isVisible = false;
            return obj;
        }, ms);
    },
};
