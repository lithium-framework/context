const fs = require('fs');
const path = require('path');
const { exec , spawn } = require('child_process');

// Fonction pour installer un module npm
function install(moduleNames , options = {} ) {

  options = {
    saveDev : false,
    savePeer : false,
    save : true,
    ...options
  }

  return new Promise(( next , reject ) => {
    
    let command_options = [];
    if(options.save)command_options.push('--save');
    else if(options.savePeer)command_options.push('--save-peer');
    else if(options.saveDev)command_options.push('--save-dev');

    if(Array.isArray( moduleNames ))moduleNames = moduleNames.join(' ');
    command_options = command_options.join(' ');
    let command = `npm install ${command_options} ${moduleNames}`;

    const child = spawn(command, ['install' , command_options , moduleNames], { shell: true });

    child.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
  
    child.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
  
    child.on('error', (error) => {
      console.error(`error: ${error.message}`);
      reject(error)
    });
  
    child.on('close', (code) => {

      if (code !== 0) {
        console.error(`Process exited with code: ${code}`);
        reject(1);
      } else {
        console.log(`Latest modules installation success for ${moduleNames} with [${command_options}] options`);
        next(0)
      }
    });

  })
}

async function main(){

  let packageJson = JSON.parse( fs.readFileSync('package.json' , 'utf-8') );

  let infrasoft_modules = {
    peerDependencies : Object.keys(packageJson["peerDependencies"] || {}).reduce(( result , key ) => { 
      if(key.includes('@lithium-framework'))result.push(`${key}@latest`);
      return result;
    } , []),
    dependencies : Object.keys(packageJson["dependencies"] || {}).reduce(( result , key ) => { 
      if(key.includes('@lithium-framework'))result.push(`${key}@latest`);
      return result;
    } , []),
    devDependencies : Object.keys(packageJson["devDependencies"] || {}).reduce(( result , key ) => { 
      if(key.includes('@lithium-framework'))result.push(`${key}@latest`);
      return result;
    } , [])
  };

  console.log(`${infrasoft_modules["peerDependencies"].length} peerDependencies to update`);
  if(infrasoft_modules["peerDependencies"].length > 0)await install( infrasoft_modules["peerDependencies"] , { save : false , savePeer : true } );
  console.log(`${infrasoft_modules["dependencies"].length} peerDependencies to update`);
  if(infrasoft_modules["dependencies"].length > 0)await install( infrasoft_modules["dependencies"] , { save : true } );
  console.log(`${infrasoft_modules["devDependencies"].length} peerDependencies to update`);
  if(infrasoft_modules["devDependencies"].length > 0)await install( infrasoft_modules["devDependencies"] , { save : false , saveDev : true } );

}

main()
.then(() => {
  process.exit(0);
})