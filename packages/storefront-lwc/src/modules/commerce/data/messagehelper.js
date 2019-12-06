
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
    }
};
