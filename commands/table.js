const {prompt} = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const fs = require('fs')
const path = require('path')

const { question } = require(`${__dirname}/../questions/table_question`);
const tplList = require(`${__dirname}/../templates`);

module.exports = prompt(question).then((result) => {
    console.log(result);
})