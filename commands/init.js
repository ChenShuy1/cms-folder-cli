const {prompt} = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const fs = require('fs')
const path = require('path')

const tplList = require(`${__dirname}/../templates`)

const { question, getInfoQuestion } = require(`${__dirname}/../question`);

module.exports = prompt(getInfoQuestion).then(({moduleName, template}) => {
  
  // 判断选择了一级目录还是二级目录，选择了二级目录则增加一个输入一级目录名称的问题
  if (template === 'secondary-folder') {
    question.splice(
      0, 0, 
      {
      type: 'input',
      name: 'parent',
      message: 'parent folder name',
      default: 'default-parent',
      filter(val) {
        return val.trim()
      },
      validate(val) {
        return true;
      },
      transformer(val) {
        return val;
      }
    });
  }
  
  prompt(question).then(({parent, name, alias, description, author, emailprefix}) => {
    const folderName = `${moduleName}${parent?`-${parent}`:''}-${name}`;
    const templateName = template;
    const gitPlace = tplList[templateName]['place'];
    const gitBranch = tplList[templateName]['branch'];
    // 作者的前缀信息
    const prefixInfomation = `
/*
* --------------------------------------------
* @name ${folderName} / ${alias}
* @desription ${description ? description : ''}
* @author ${author} ${emailprefix ? (`(${emailprefix}@corp.netease.com)`) : ''}
* --------------------------------------------
*/

`;
    // 判断文件夹是否存在
    if (fs.existsSync(`${process.cwd()}/${folderName}`)) {
      console.log(chalk.bold.red('文件夹已经存在！'));
      process.exit()
    }
    const spinner = ora('Downloading please wait...');
    spinner.start();
    download(`${gitPlace}${gitBranch}`, `./${folderName}`, (err) => {
      if (err) {
        console.log(chalk.red(err))
        process.exit()
      }
      
      try {
        // 读取index文件，插入作者信息
        const data = fs.readFileSync(`./${folderName}/index.js`, 'utf8');
        const updatedata = prefixInfomation + data;
        fs.writeFileSync(`./${folderName}/index.js`, updatedata, 'utf8');

        // 读取meta文件，修改内容
        let meta = fs.readFileSync(`./${folderName}/meta.conf`, 'utf8');
        
        meta = JSON.parse(meta);
        meta.name = name;
        meta.url = name;
        meta.alias = alias;
        meta.privilegeCode = `module_${moduleName}_${parent ? `${parent}_` : ''}_${name}`;
        const updatemeta = JSON.stringify(meta, null, 2);
        fs.writeFileSync(`./${folderName}/meta.conf`, updatemeta, 'utf8');

        spinner.stop();
        console.log(chalk.green('project init successfully!'))
        console.log(`
          ${chalk.yellow('foldername: ') + chalk.bgWhite.black(`${folderName}`)}
        `);
      } catch(err) {
        spinner.stop();
        console.log(err);
        return;
      }
    });
  })
});
