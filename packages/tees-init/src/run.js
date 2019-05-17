const fs = require('fs');
const path = require('path');
const init = require('init-package-json')

function compile({
  keys,
  values,
  template,
}) {
  const renderTemplate = new Function(...keys, `return \`${template}\``);
  return renderTemplate(...values);
}

function ensureDirSync (dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
    console.log('Dir exist!');
  }
}

function initPackageJson(initPath, config) {
  return new Promise((resolve, reject)=> {
    console.log('configData', config);
    const initFile = path.join(__dirname, '../npm-init.js');
    console.log('initFile', initFile);
    init(initPath, 'file that does not exist', config, function (err, data) {
      if (!err) {
        console.log('package.json init successfully');
        resolve(data);
      } else {
        reject();
      }
    })
  })
}

async function run(projectName, cmd) {
    console.log('projectName', projectName);
    ensureDirSync(path.join(process.cwd(), projectName));
    ensureDirSync(path.join(process.cwd(), `${projectName}/src`));
    const config = {
      name: projectName,
      dependencies: {tees: '1.0.2'},
      description: "a test aaaa"
    }
    const packageJson = await initPackageJson(path.join(process.cwd(), projectName), config);
    console.log('packageJson', packageJson);
    fs.readFile(path.join(__dirname, './e2eConfigTemplate.js'), 'utf-8', async (err, data) => {
      template = data.toString();
      const configObj = {
        projectName
      }
      const result = compile({
        template,
        keys: Object.keys(configObj),
        values: Object.values(configObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/e2e.config.js`), result, 'ascii', (err) => {
        if (err) throw new Error(err);
      });
    });

    fs.readFile(path.join(__dirname, './packageTemplate.js'), 'utf-8', async (err, data) => {
      template = data.toString();
      const packageObj = {
        projectName,
        projectVersion,
        description,
        mainFile,
        teesVersion,
        license
      }
      const result = compile({
        template,
        keys: Object.keys(packageObj),
        values: Object.values(packageObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/e2e.config.js`), result, 'ascii', (err) => {
        if (err) throw new Error(err);
      });
    });
}


module.exports = {
  run,
};