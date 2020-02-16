const { strict: assert } = require('assert');
const querystring = require('querystring');
const { inspect } = require('util');

const isEmpty = require('lodash/isEmpty');
const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved

const Account = require('./account')();

const body = urlencoded({ extended: false });

const keys = new Set();
const debug = (obj) => querystring.stringify(Object.entries(obj).reduce((acc, [key, value]) => {
  keys.add(key);
  if (isEmpty(value)) return acc;
  acc[key] = inspect(value, { depth: null });
  return acc;
}, {}), '<br/>', ': ', {
  encodeURIComponent(value) { return keys.has(value) ? `<strong>${value}</strong>` : value; },
});

module.exports = (app, provider) => {
  const { constructor: { errors: { SessionNotFound } } } = provider;

  app.use((req, res, next) => {
    const orig = res.render;
    // you'll probably want to use a full blown render engine capable of layouts
    res.render = (view, locals) => {
      app.render(view, locals, (err, html) => {
        if (err) throw err;
        orig.call(res, '_layout', {
          ...locals,
          body: html,
        });
      });
    };
    next();
  });

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
  }

  app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      const {
        uid, prompt, params, session,
      } = await provider.interactionDetails(req, res);

      const client = await provider.Client.find(params.client_id);

      let pageName = prompt.name;
      if (details.lastSubmission && details.lastSubmission.prompt) {
        pageName = details.lastSubmission.prompt;
      }

      switch (pageName) {
        case 'select_account': {
          if (!session) {
            return provider.interactionFinished(req, res, { select_account: {} }, { mergeWithLastSubmission: false });
          }

          const account = await provider.Account.findAccount(undefined, session.accountId);
          const { email } = await account.claims('prompt', 'email', { email: null }, []);

          return res.render('select_account', {
            client  : client,
            uid     : details.uid,
            email   : email,
            details : details.prompt.details,
            params  : details.params,
            title   : 'Sign-in',
            session : setails.session ? debug(details.session) : undefined
          });
        }
        case 'login': {
          return res.render('login', {
            authError : details.lastSubmission && details.lastSubmission.login && details.lastSubmission.login.account === null ? true : false,
            client    : client,
            uid       : details.uid,
            details   : details.prompt.details,
            params    : details.params,
            title     : 'Sign-in',
            session   : details.session ? debug(details.session) : undefined
          });
        }
        case 'register': {
          return res.render('register', {
            client    : client,
            uid       : details.uid,
            details   : details.prompt.details,
            params    : details.params,
            title     : 'Register',
            session   : details.session ? debug(details.session) : undefined
          });
        }
        case 'consent': {
          return res.render('interaction', {
            client  : client,
            uid     : details.uid,
            details : details.prompt.details,
            params  : details.params,
            title   : 'Authorize',
            session : details.session ? debug(details.session) : undefined
          });
        }
        default:
          return undefined;
      }
    } catch (err) {
      return next(err);
    }
  });

  app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
    try {
      const account = await Account.findByLogin(req.body.login, req.body.password);
      const result = {
        select_account: {},
        login: {
          account: account ? account.accountId : null,
        },
      };

      console.log("LOGIN", result);

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.post('/interaction/:uid/register', setNoCache, body, async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      let account = await Account.findByLogin(req.body.login, req.body.password);

      const result = {
        select_account : {},
        login : {
          account : null,
          duplicate : true
        }
      };

      if (!account) {
        account = await Account.registerUser(req.body.login, req.body.password);
        result.login.account = account.accountId;
        result.login.duplicate = false;
      }

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  app.post('/interaction/:uid/continue', setNoCache, body, async (req, res, next) => {
    try {
      const interaction = await provider.interactionDetails(req, res);
      const { prompt: { name, details } } = interaction;
      assert.equal(name, 'select_account');

      if (req.body.switch) {
        if (interaction.params.prompt) {
          const prompts = new Set(interaction.params.prompt.split(' '));
          prompts.add('login');
          interaction.params.prompt = [...prompts].join(' ');
        } else {
          interaction.params.prompt = 'logout';
        }
        await interaction.save();
      }

      const result = { select_account: {} };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
    try {
      const { prompt: { name, details } } = await provider.interactionDetails(req, res);
      assert.equal(name, 'consent');

      const consent = {};
      // any scopes you do not wish to grant go in here
      //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
      consent.rejectedScopes = [];

      // any claims you do not wish to grant go in here
      //   otherwise all claims mapped to granted scopes
      //   and details.claims.new.concat(details.claims.accepted) will be granted
      consent.rejectedClaims = [];

      // replace = false means previously rejected scopes and claims remain rejected
      // changing this to true will remove those rejections in favour of just what you rejected above
      consent.replace = false;

      const result = { consent };

      console.log(result);

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  app.get('/interaction/:uid/register', setNoCache, async (req, res, next) => {
    try {
      const result = {
        prompt : 'register'
      };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission : false });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    console.log(err);

    if (err instanceof SessionNotFound) {

      // handle interaction expired / session not found error
    }
    next(err);
  });
};