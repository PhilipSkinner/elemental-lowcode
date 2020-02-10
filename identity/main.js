const 
	Provider 		= require('oidc-provider'),
	clientProvider 	= require('./lib/configProvider')();

clientProvider.fetchConfig(process.env.DIR, process.env.SECRET).then((config) => {
	const oidc = new Provider(`http://localhost:${process.env.PORT}`, config);
	const server = oidc.listen(process.env.PORT, () => {
  		console.log(`oidc-provider listening on port ${process.env.PORT}, check http://localhost:${process.env.PORT}/.well-known/openid-configuration`);
	});
});