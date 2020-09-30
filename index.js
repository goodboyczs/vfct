const fs = require('fs')
const COMMANDER = require('commander')
const inquirer = require('inquirer')

//创建文件
const createVue = function (name, dirPath) {
  fs.open(dirPath, function (err, fd) {
    if (err) throw new Error(`未找到${dirPath}路径，请确认是否为Vue工程!`)
    let path = `${dirPath}/${name}.vue`
    fs.access(path, err => {
      if (!err) throw new Error(`${name} 文件名已被占用`)
      let tpl = `<template>\n  <div>请开始你的表演！</div>\n</template>\n<script>\nexport default {\n  name: '${name}',\n  data() {\n    return {}\n  },\n  computed: {},\n  created() {},\n  mounted() {},\n  watch: {},\n  methods: {},\n  components: {}\n}\n</script>\n<style scoped lang="scss"></style>`
      fs.writeFile(path, tpl, err => {
        if (err) throw new Error(err)
        console.info(`${path} 创建完成！`)
      })
    })
  })
}

//创建文件夹
const createDir = function (cop) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'dirName',
          message: '请输入文件夹'
        }
      ])
      .then(answer => {
        let dirPath = `./src/${cop}`
        fs.open(dirPath, function (err, fd) {
          if (err) throw new Error(`未找到${dirPath}路径，请确认是否为Vue工程!`)
          dirPath += `/${answer.dirName}`
          fs.access(dirPath, err => {
            if (err) {
              console.info(`未找到${dirPath}`)
              fs.mkdir(dirPath, back => {
                console.info(`已创建${dirPath}`)
                resolve(answer.dirName)
              })
            } else {
              console.info(`已找到${dirPath}`)
              resolve(answer.dirName)
            }
          })
        })
      })
  })
}

//命令主体
COMMANDER.version('1.0.0', '-v', '--version')
  .command('create <name>')
  .action(name => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'status',
          message: '请选择创建形式ヾ(@^▽^@)ノ',
          choices: [
            {
              name: 'components下的组件'
            },
            {
              name: 'views下的页面'
            },
            {
              name: 'components下某个目录内的组件'
            },
            {
              name: 'views下某个目录内的页面'
            }
          ]
        }
      ])
      .then(answer => {
        if (answer.status === 'components下的组件') {
          createVue(name, './src/components')
          return
        }
        if (answer.status === 'views下的页面') {
          createVue(name, './src/views')
          return
        }
        if (answer.status === 'components下某个目录内的组件') {
          createDir('components').then(dirName => {
            createVue(name, `./src/components/${dirName}`)
          })
          return
        }
        if (answer.status === 'views下某个目录内的页面') {
          createDir('views').then(dirName => {
            createVue(name, `./src/views/${dirName}`)
          })
          return
        }
      })
  })
COMMANDER.parse(process.argv)
