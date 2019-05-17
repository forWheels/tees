#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const packageJson = require('../package');
const { run } = require('../src/run');


// commander
//   .version(info.version) // 版本
//   .usage('<command> [options]'); // 使用方法

// commander
//   .command('init []')


// 举例 用户输入npx create-react-app my-app
commander
  .command('init') // create-react-app
  .version(packageJson.version)
  // .arguments('<project-directory>')  // my-app
  .usage(`${chalk.green('<project-directory>')} [options]`) // my-app 后面加选项
  .action(run)


// inquirer
//   .prompt([
//     /* Pass your questions in here */


//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//   });

commander.parse(process.argv)
