const {series} = require('gulp');

const copy = async () => require('@greenminds/nf-dev-server/gulp/copy')();
const create = async () => require('@greenminds/nf-dev-server/gulp/create')();
const css = async () => require('@greenminds/nf-dev-server/gulp/css')();
const dataCore = async () => require('@greenminds/nf-dev-server/gulp/dataCore')();
const dataRoot = async () => require('@greenminds/nf-dev-server/gulp/dataRoot')();
const dataRoutes = async () => require('@greenminds/nf-dev-server/gulp/dataRoutes')();
const del = async () => require('@greenminds/nf-dev-server/gulp/del')();
const endpoints = async () => require('@greenminds/nf-dev-server/gulp/endpoints')();
const favicon = async () => require('@greenminds/nf-dev-server/gulp/favicon')();
const from = async () => require('@greenminds/nf-dev-server/gulp/from')();
const go = async () => require('@greenminds/nf-dev-server/gulp/go')();
const js = async () => require('@greenminds/nf-dev-server/gulp/js')();
const lint = async () => require('@greenminds/nf-dev-server/gulp/lint')();
const projectRoot = async () => require('@greenminds/nf-dev-server/gulp/root')();
const views = async () => require('@greenminds/nf-dev-server/gulp/views')();
const make = series(copy, css, dataRoutes, dataCore, endpoints, projectRoot, dataRoot, js);

module.exports = {
  copy,
  create,
  css,
  dataCore,
  dataRoot,
  dataRoutes,
  del,
  endpoints,
  favicon,
  from,
  go,
  js,
  lint,
  projectRoot,
  views,
  build: series(from, del, make),
  default: series(from, views, make, go),
};
