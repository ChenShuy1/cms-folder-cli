#!/usr/bin/env node
process.env.NODE_PATH = __dirname + '/../node_modules/'
const { resolve } = require('path')
const res = command => resolve(__dirname, '../commands/', command)
const program = require('commander')

program.version(require('../package').version )

// 表示下面开始为命令
program.usage('<command>')

program.command('init')
  .description('新建一个cms文件夹')
  .alias('i')
  .action(() => {
    require(res('init'))
  })

program.command('table')
  .description('新建增删查改表格')
  .alias('t')
  .action(() => {
    require(res('table'))
  })

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);

// 如果不输入指令则输出help
if(!program.args.length) {
  program.help();
}