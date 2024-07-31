const fs = require('fs');
const path = require('path');

const pwd = process.env.PWD ? process.env.PWD : process.pwd();
const env = process.env.NODE_ENV || 'development';

function updateDistributionPath(){

  let _package = JSON.parse( fs.readFileSync( path.resolve(pwd, 'package.json') , 'utf-8' ) );

  _package.main = env == "production" ? "./index.js" : "./dist/index.js";

  fs.writeFileSync( path.resolve(pwd, 'package.json') , JSON.stringify(_package, null, 2) )

  console.log(`package.json main distribution set for ${env} environment.`);

}

module.exports = {
  updateDistributionPath
}