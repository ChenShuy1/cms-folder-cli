const {prompt} = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const fs = require('fs')
const path = require('path')

const option =  program.parse(process.argv).args[0]
const defaultName = typeof option === 'string' ? option : 'platform-default-folder'
const tplList = require(`${__dirname}/../templates`)
const tplLists = Object.keys(tplList) || [];
const question = [
  {
    type: 'input',
    name: 'name',
    message: 'Folder Name',
    default: defaultName,
    filter(val) {
      return val.trim()
    },
    validate(val) {
      const validate = (val.trim().split(" ")).length === 1
      return validate || '文件名不允许出现空格';
    },
    transformer(val) {
      return val;
    }
  }, {
    type: 'input',
    name: 'alias',
    message: 'folder alias',
    default: '默认别名',
    filter(val) {
      return val.trim()
    },
    validate(val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }, {
    type: 'list',
    name: 'template',
    message: 'folder template',
    choices: tplLists,
    default: tplLists[0],
    validate(val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }, {
    type: 'input',
    name: 'description',
    message: 'Folder description',
    default: 'folder description',
    validate (val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }, {
    type: 'input',
    name: 'author',
    message: 'Author',
    default: 'folder author',
    validate (val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }, {
    type: 'input',
    name: 'email',
    message: 'Email prefix',
    default: null,
    validate (val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }
]
module.exports = prompt(question).then(({name, alias, template, description, author, emailprefix}) => {
  const folderName = name;
  const templateName = template;
  const gitPlace = tplList[templateName]['place'];
  const gitBranch = tplList[templateName]['branch'];
  const spinner = ora('Downloading please wait...');
  spinner.start();
  const prefixInfomation = `
  /*
  * --------------------------------------------
  * @name ${name} / ${alias}
  * @desription ${description}
  * @author ${author} ${emailprefix ? (`${emailprefix}@corp.netease.com`) : ''}
  * --------------------------------------------
  */

`
  download(`${gitPlace}${gitBranch}`, `./${folderName}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    // 读取index文件，插入作者信息
    fs.readFile(`./${folderName}/index.js`, 'utf8', function(err, data) {
      if (err) {
        spinner.stop();
        console.log(err);
        return;
      }
      const updatedata = prefixInfomation + data;
      fs.writeFile(filepath, updatedata, 'utf8', (err) => {
        // return new Promise((resolve, reject) => {
        //   if (err) {
        //     reject(err);
        //   } else {
        //     resolve();
        //   }
        // })
      })
    });
    // 读取meta文件
    fs.readFile(`./${folderName}/meta.conf`, 'utf8', function(err, data) {
      if (err) {
        spinner.stop();
        console.log(err);
        return;
      }

      const meta = JSON.parse(data);
      meta.name = name;
      meta.url = name;
      meta.alias = alias;
      var updatemeta = JSON.stringify(meta, null, 2);
      fs.writeFile(`./${folderName}/meta.conf`, updatemeta, 'utf8', (err) => {
          if(err) {
            spinner.stop();
            console.error(err);
            return;
          } else {
            spinner.stop();
            console.log(chalk.green('project init successfully!'))
            console.log(`
              ${chalk.bgWhite.black('   Run Application  ')}
              ${chalk.yellow(`cd ${name}`)}
              ${chalk.yellow('npm install')}
              ${chalk.yellow('npm start')}
            `);
          }
      });
    });
  });
});