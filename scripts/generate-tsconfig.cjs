const fs = require('fs');
const path = require('path');
const { updateDistributionPath } = require('./update-distribution-path.cjs');

console.log({ env : process.env.NODE_ENV })

const pwd = process.env.PWD ? process.env.PWD : process.pwd();
const env = process.env.NODE_ENV || 'development';

const tsconfig = {
  compilerOptions: {
    module: "ESNext",
    target: "ESNext",
    declaration: true,
    sourceMap: true,
    rootDir: "./src",
    outDir: env === 'production' ? "." : "./dist",
    removeComments: false,
    preserveConstEnums: true,
    skipLibCheck: true,
    moduleResolution: "node",
    strict: false,
    noImplicitAny: false,
    esModuleInterop: true,
    resolveJsonModule: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    baseUrl: "./",
    paths: {
      "@lithium-framework/*": ["node_modules/@lithium-framework/*"]
    }
  },
  include: [
    "src/**/*.ts",
  ],
  exclude: [
    "node_modules"
  ]
};

fs.writeFileSync(path.resolve(pwd, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
console.log(`tsconfig.json generated for ${env} environment.`);

updateDistributionPath();
