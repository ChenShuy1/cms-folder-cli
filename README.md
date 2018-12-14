## cms-folder-cli
##### cms-folder-cli可以帮助你快速构建cms后台的文件夹
### installation
npm包还未发布  
### Usage
```js
cms init
> module name // 选择模块类型
> folder template type // 模块模板类型
> parent // 如果是二级目录就需要输入父级目录
> folder name // 文件夹名称
> alias // 别名，与meta的alias一致
> folder description // 文件夹说明
> author // 作者名
> email prefix // 邮件前缀
```

注意：`folder name`在输入时只需要输入最后一个名字，会自动生成名为modulename-parent-foldername的文件夹（比如platform-sati-setting）。
