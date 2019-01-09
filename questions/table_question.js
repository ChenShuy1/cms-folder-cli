
exports.question = [{
    type: 'input',
    name: 'name',
    message: '表格列表名',
    required: true,
    filter(val) {
      return val.trim()
    },
    validate( input ) {
      const validate = (input.trim().split(" ")).length === 1;
      return validate || ('表格列表名不允许出现空格');
    },
    transformer(val) {
      return val;
    }
}, {
    type: 'input',
    name: 'columns',
    message: '列表名 列表id，用逗号分割',
    transformer(val) {
      return val;
    },
    validate( ...args ) {
        console.log(args);
        return true;
    },
}]