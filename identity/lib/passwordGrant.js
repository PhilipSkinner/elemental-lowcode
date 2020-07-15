const handler = function(accountDB, get, uidToGrantId, InvalidGrant, presence, instance, checkPKCE, revokeGrant) {
	const gty = "password";

	return async function(ctx, next) {
		const authTime = Math.floor(new Date() / 1000);

		//get the account
	    const user = await accountDB.findByLogin(ctx.oidc.params.username, ctx.oidc.params.password);
	    const {
			issueRefreshToken,
			audiences,
			conformIdTokenClaims,
			features: { userinfo, dPoP: { iatTolerance }, mTLS: { getCertificate } },
		} = instance(ctx.oidc.provider).configuration();

		let cert;
		if (ctx.oidc.client.tlsClientCertificateBoundAccessTokens) {
			cert = getCertificate(ctx);
			if (!cert) {
				throw new InvalidGrant('mutual TLS client certificate not provided');
			}
		}

		const account = user;

		if (!account) {
			throw new InvalidGrant('Invalid credentials.');
		}
		ctx.oidc.entity('Account', account);

		const {
			AccessToken, IdToken, RefreshToken, ReplayDetection,
		} = ctx.oidc.provider;

		const at = new AccessToken({
			accountId           : account.accountId,
			claims              : account.claims,
			client              : ctx.oidc.client,
			expiresWithSession  : false,
			grantId             : ctx.oidc.uid,
			gty,
			scope               : ctx.oidc.params.scope,
			sessionUid          : ctx.oidc.uid,
			sid                 : ctx.oidc.uid
		});

		const acClaims = await accountDB.extraAccessTokenClaims(null)(ctx, at);
		at.accountId = acClaims.sub;

		if (ctx.oidc.client.tlsClientCertificateBoundAccessTokens) {
			at.setThumbprint('x5t', cert);
		}

		const { dPoP } = ctx.oidc;

		if (dPoP) {
			const unique = await ReplayDetection.unique(
				ctx.oidc.client.clientId, dPoP.jti, dPoP.iat + iatTolerance,
			);

			ctx.assert(unique, new InvalidGrant('DPoP Token Replay detected'));

			at.setThumbprint('jkt', dPoP.jwk);
		}

		at.setAudiences(await audiences(ctx, account.accountId, at, 'access_token'));

		ctx.oidc.entity('AccessToken', at);
		const accessToken = await at.save();

		let refreshToken;
		if (true) {
		const rt = new RefreshToken({
			accountId 			: account.accountId,
			authTime 			: authTime,
			claims 				: account.claims,
			client 				: ctx.oidc.client,
			expiresWithSession 	: false,
			grantId 			: ctx.oidc.uid,
			gty,
			rotations 			: 0,
			scope 				: ctx.oidc.params.scope,
			sessionUid 			: ctx.oidc.uid,
			sid 				: ctx.oidc.uid,
		});

		if (ctx.oidc.client.tokenEndpointAuthMethod === 'none') {
			if (at.jkt) {
				rt.jkt = at.jkt;
			}

			if (ctx.oidc.client.tlsClientCertificateBoundAccessTokens) {
				rt['x5t#S256'] = at['x5t#S256'];
			}
		}

		ctx.oidc.entity('RefreshToken', rt);
			refreshToken = await rt.save();
		}

		let idToken;
		if (ctx.oidc.params.scope.indexOf('openid') !== -1) {
			const claims = get(account, 'claims.id_token', {});
			const rejected = get(account, 'claims.rejected', []);
			const token = new IdToken({
				...await account.claims('id_token', ctx.oidc.params.scope, claims, rejected),
				acr: "acr",
				amr: "amr",
				auth_time: authTime,
			}, { ctx });

			if (conformIdTokenClaims && userinfo.enabled) {
				token.scope = 'openid';
			} else {
				token.scope = ctx.oidc.params.scope;
			}

			token.mask = claims;
			token.rejected = rejected;

			token.set('at_hash', accessToken);
			token.set('sid', ctx.oidc.uid);

			idToken = await token.issue({ use: 'idtoken' });
		}

		ctx.body = {
			access_token: accessToken,
			expires_in: at.expiration,
			id_token: idToken,
			refresh_token: refreshToken,
			scope: ctx.oidc.params.scope,
			token_type: at.tokenType,
		};

		await next();
	};
};

module.exports = function(accountDB, get, uidToGrantId, InvalidGrant, presence, instance, checkPKCE, revokeGrant) {
	if (!accountDB) {
		accountDB = require('./account')();
	}

	if (!get) {
		get = require('lodash/get');
	}

	if (!uidToGrantId) {
		uidToGrantId = require('debug')('oidc-provider:uid');
	}

	if (!InvalidGrant) {
		InvalidGrant = require('oidc-provider/lib/helpers/errors').InvalidGrant;
	}

	if (presence) {
		presence = require('oidc-provider/lib/helpers/validate_presence');
	}

	if (!instance) {
		instance = require('oidc-provider/lib/helpers/weak_cache');
	}

	if (!checkPKCE) {
		checkPKCE = require('oidc-provider/lib/helpers/pkce');
	}

	if (!revokeGrant) {
		revokeGrant = require('oidc-provider/lib/helpers/revoke_grant');
	}

	return handler(accountDB, get, uidToGrantId, InvalidGrant, presence, instance, checkPKCE, revokeGrant);
};