const bidResolver = require("./bidResolver");
const companyResolver = require("./companyResolver");
const studyResolver = require("./studyResolver");
const serviceResolver = require("./serviceResolver");
const regionResolver = require("./regionResolver");
const therapeuticResolver = require("./therapeuticResolver");
const specialtyResolver = require("./specialtyResolver");

module.exports = [
  bidResolver,
  companyResolver,
  studyResolver,
  serviceResolver,
  regionResolver,
  therapeuticResolver,
  specialtyResolver,
];
