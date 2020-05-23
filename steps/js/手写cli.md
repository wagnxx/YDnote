# 手写类似vue-cli

- npm init
- package.json中加入 bin字段
- 创建 bin 文件夹，里面创建 shell脚本文件,例如：
```
#!/usr/bin/env
// 以上是声明


// code  部分
const program = require('commander');
const Printer =require('@darkobits/lolcatjs');
 

const input=[
'                _',
'    _   _    __| |',
'   | | | |  / _` |',
'   | |_| | | (_| |',
'    \__,  |   \__,_|',
'    |___/ '        ,
].join('\n');

program.version(Printer.default.fromString(input),"-v,--version")
.parse(process.argv);

```
- shelljs 简单语法
```
//局部模式
var shell = require('shelljs');
//全局模式下，就不需要用shell开头了。
//require('shelljs/global');

if (shell.exec('npm run build').code !== 0) {//执行npm run build 命令
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}

//由于我的用另外一个仓库存放dist目录，所以这里要将文件增量复制到目标目录。并切换到对应目录。
shell.cp ('-r', './dist/*', '../../Rychou');
shell.cd('../../Rychou');

shell.exec('git add .');
shell.exec("git commit -m 'autocommit'")
shell.exec('git push')

```

#### 以上就实现简单的shell ，要写个完整的cli 需要进一步学习shell知识，后期继续修补