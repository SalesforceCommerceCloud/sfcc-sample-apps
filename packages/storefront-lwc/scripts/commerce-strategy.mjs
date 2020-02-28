/**
 * Module dependencies.
 */
import passport from 'passport-strategy';
import util from 'util';

/**
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('CommerceStrategy requires a verify callback'); }

  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';

  passport.Strategy.call(this);
  this.name = 'commerce';
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  options = options || {};

  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  try {
    commerceAuthenticate(req, this);
    //this._verify(req, username, password, verified);
  } catch (ex) {
    return self.error(ex);
  }
};

function commerceAuthenticate(req, auth) {
    console.log("We don't have a user! Let's create an anonymous user");
    const body = {
      type: 'guest'
    };
    const getTokenUrl = '*******';
    fetch(getTokenUrl, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      const token = response.headers.get('Authorization');
      console.log(token);
      response.json().then(json => {
        auth.success({id: json.customer_id, token});
      }).catch(error => auth.error(error));
    }).catch(error => auth.error(error));
}

/**
 * Expose `Strategy`.
 */
export default Strategy;
