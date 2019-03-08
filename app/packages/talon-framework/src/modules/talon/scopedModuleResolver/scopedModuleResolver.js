import { Resolver } from './resolver';
import salesforce from './salesforce';

// resolvers from TalonCompat global i.e. @babel/runtime
const compatResolvers = self.TalonCompat ? self.TalonCompat.resolvers : [];

/**
 * A resolver for scoped modules like '@salesforce/apex/LoginFormController.login',
 * '@salesforce/cssvars/customProperties' or '@babel/helpers/classCallCheck'.
 *
 * A resolver is an object with a `resolve(scopedResource)` method.
 */
export default new Resolver([
    salesforce,
    ...compatResolvers
]);
