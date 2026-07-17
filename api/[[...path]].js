const app = require('../artifacts/api-server/dist/index.cjs');

module.exports = function handler(req, res) {
  return app(req, res);
};
