module.exports = async function handler(req, res) {
  const mod = await import('../artifacts/api-server/dist/index.mjs');
  return mod.default(req, res);
};
