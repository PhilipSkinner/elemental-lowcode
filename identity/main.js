const { Provider } = require('oidc-provider');
const configuration = {
  clients: [],
};

const oidc = new Provider(`http://localhost:${process.env.PORT}`, configuration);
const server = oidc.listen(process.env.PORT, () => {
  console.log(`oidc-provider listening on port ${process.env.PORT}, check http://localhost:${process.env.PORT}/.well-known/openid-configuration`);
});