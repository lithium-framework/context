const semver = require('semver');
const fs = require('fs');

async function main() {
  const localPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  let result = await fetch(`https://registry.npmjs.org/${localPackageJson.name}/latest`);
  let npmPackageJson = await result.json();

  if (npmPackageJson == 'Not Found') {
    return 'Not Found';
  } else {
    let { version: npmVersion } = npmPackageJson;
    let { version: localVersion } = localPackageJson;

    let diff = semver.diff(npmVersion, localVersion);

    if (diff === 'patch' || diff === 'minor' || diff === 'major' || diff === 'preminor' || diff === 'premajor') {
      return diff;
    } else {
      return 'no significant difference';
    }
  }
}

main()
.then((diff) => {
  process.stdout.write(diff);
  process.exit(0);
})
.catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
