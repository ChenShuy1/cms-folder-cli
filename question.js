const fs = require('fs')

const defaultName = 'defaultfolder'
const tplList = require(`${__dirname}/templates`)
const moduleList = require(`${__dirname}/modules`)
const tplLists = Object.keys(tplList) || [];

exports.getInfoQuestion = [
    {
        type: 'list',
        name: 'moduleName',
        choices: moduleList,
        default: moduleList[0],
        validate(val) {
          return true;
        },
        transformer(val) {
          return val;
        }
      },
      {
        type: 'list',
        name: 'template',
        message: 'folder template type',
        choices: tplLists,
        default: tplLists[0],
        validate(val) {
          return true;
        },
        transformer(val) {
          return val;
        }
      },
];

exports.question = [
    {
      type: 'input',
      name: 'name',
      message: 'Folder Name',
      default: defaultName,
      filter(val) {
        return val.trim()
      },
      async validate( input ) {
        // 下面这行代码用于通知异步任务
        const done = this.async();
        
        if (!(input.trim().split(" ")).length === 1) {
          done('文件名不允许出现空格');
          return;
        }
        if ( await fs.exists(`${process.cwd()}/${input}`) ) {
          done( '该文件夹已经存在！' );
        }
        done( null, true );
      },
      transformer(val) {
        return val;
      }
    }, {
      type: 'input',
      name: 'alias',
      message: 'alias',
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
      default: 'author',
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
  ];
