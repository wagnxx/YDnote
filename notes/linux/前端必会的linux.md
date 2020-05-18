## 前端必会的 Linux 知识

一.预备知识 ---目录简介

- ect：主要存储配置文件。

```
// 举例：网卡未激活时候解决办法

cd /etc/sysconfig/network-scripts/

// 查看 ens33网卡详情
    cat ifcfg-ens33
// 修改ifcfg-ens33

    vi ifcfg-ens33
// 修改onboot
    ONBOOT="yes"

// 重启网卡
// 先关掉ens33
    ifdown ens33
// 再激活ens33
    ifup ens33


```

- root:超管家目录
- home:普通用户家目录
- boot:系统核心文件，如启动文件，系统核心文件，轻易不要碰这个目录
  一个端口在一段时间内只能被一个进程使用

## 二. 操作系统概述

1. 按工作机功能分类为：

- 古老的操作系统
- 适合工作和娱乐的 Windows
- 适合开发的 Linux
- 非常好用的 MacOS

2. Ubuntu，centos，Redhat，Fedora，debian 哪个好

- 桌面版推荐 fedora，Ubuntu
- 其他 推荐 centos

## 三. 远程登录 Linux

1. Windows 下使用的工具

- putty，xshell，cmder（cmder 下可以使用 ssh）

2. Linux 和 MacOS 下

- ssh 命令

## 四. 常用的 Linux 命令

1. 行编辑器： vi/vim
2. 服务管理命令：systemctl
   > Windows 下叫服务，linux 下叫守护进程，其自命令有：

- start，stop，restart
- enable/ disable
  > 当 httpd 和 nginx 起冲突时，可以禁掉 httpd；
  > systemctl disable httpd

3. 网络管理命令

- ifconfig
- ip
- route

4. 命令行下载工具

- wget，wget -c （参数 c 代表断点续传）
- curl 较为复杂，后续学习

5. Linux 帮助命令

- man （man wget）

## 五. linux 进程管理

1. top 命令，查看比较异常的命令
2. ps ，查看进程的命令 s
   > 当前用户不是 root 时需加 sudo，不然只会显示当前用户的进程，用法：
   > ps aux | grep node
3. kill,pkill 命令 ,向 linux 内核发送命令

- kill pid (pid 为进程号，尽量选小，一般小的表示为主进程，因为如果是子进程的话有可能杀不干净)
- pkill panme （pname 为进程名字）
- kill -9 （9 号命令表示关闭）

4. w ，查看谁在当前系统上

## 六. Linux 网络管理

1. 查看和配置网络的基本信息 ifconfig，ip
2. 重启网卡 ？（在前部分）
3. 怎样找到占用网络端口的进程

- ss
- netstat
- lsof
- 找到冲突后 配合 systemctl 解决

## 七. 进程，线程，协程

> 在 linux 系统中，不能把一切文件都笼统称为程序，严格意义上的程序是什么？\_\_\_\_?;

- 代码流程
  > 源代码---> 可执行文件 ---> 进程；
  > 从以上步骤可知：进程本质上是 可执行文件映射到内存中，CPU 逐条执行这些指令，便产生了进程，进程是一个动态的概念
- 操作系统
  > 操作系统是对硬件资源的一种调度，硬件资源是指 cpu，内存等
- 官方概念解析

1. 进程：操作系统执行任务的调度单位，目的是担当分配系统资源（CPU 时间，内存）的实体
2. 线程： 操作系统调度的最小单位 （早起的 linux 操作系统是没有线程的，只有进程，其替代方案是多任务，即同事运行多个进程，由一个主进程管理多个子进程）；线程产生的原因是进程本身非常重，每 fork 一次将会把主进程的所有代码空间和书架复制过去，造成内存资源的浪费，于是此时轻量级的线程
   > 线程产生后，线程会共享进程中的内存空间（具体为 数据和部分代码空间），因此会瘦身；
   > 一个进程跑起以后，里面必须有一个主线程，这样进程就依赖于这个主线程的运行，主线程一旦退出，进程一般也会跟着退出（除非是代码层面的阻止退出进程或者脱离进程）；
   > 当程序退出的时候，调用了内核的 api
3. 一种用户态轻量级线程，无法利用多核资源
4. cpu 密集型应用发展

- 多进程--> 多线程
- 多数桌面应用都是 CPU 密集型的，有个特点就是运算量大，长期占用内存空间

5. IO 密集型应用发展

- 多进程，多线程 ，事件驱动， 携程
- 多进程，多线程，用户不能控制，切换时由操作系统来完成
- 事件驱动，主要解决同步问题
- 协程 ，可以由程序控制切换，自己掉自己，灵活性提高了

6. 调度和切换时间

- 进程 > 线程 > 携程

## 八.进程与线程细述

1. 进程和线程的资源共享
   > 在 linux 中，所有的设备都是文件，打开一个文件时需要用文件句柄（也叫文件描述符），关闭时被回收
2. 详情

- 资源共享主要有（代码，书架，文件，寄存器，栈）
- 主进程 fork 时需要 copy 代码，数据，文件，寄存器，栈
- 生成一个线程时只需要有自己的寄存器和栈即可
- 协程和线程结构类似，只是它为用户态，操作系统不知道携程，所以不能操作协程

## 九. linux 免密登录

> 主要步骤为，生成秘钥，上传公钥到服务器，配置本地文件

1. 生成密钥对

```
    ssh keygen  -t rsa   -C 'wang@qq.com'  -f  'wang_rsa'
// 其中  参数  t为加密方式，C为写到秘钥中的名字，f为生成的秘钥文件名

```

2. 上传公钥

```
    ssh-copy-id -i '公钥文件名'  用户名@ip
    // 输入以上命令后会将公钥导入到  .ssh/authorizd-keys文件中去

```

3. 免密登录功能在本地的配置

- 在 ～/.ssh/config 中编辑（没有该文件，自行创建即可）

```
# 单机配置

    #主配项
    Host node-server   # 别名
    User root          # 别名
    HostName Ip或者域名
    IdentityFile ~/.ssh/wxx_rsa   # 私钥路径

    #必配项
    Protocol 2
    Compression yes
    SeverAliveInteral  60
    ServerAliveCountMax 20
    LogLevel     INFO




# 多机配置

    Host node-server
    HostName Ip1
    Port 22

    Host java-server
    HostName Ip2
    Port 22


    Host *-server
    User root
    IdentityFile ~/.ssh/wxx_rsa
    Protocol 2
    Compression yes
    SeverAliveInteral  60
    ServerAliveCountMax 20
    LogLevel     INFO

```

- 配置 config 的访问权限为 644

## 十.linux 安全及冲突解决

- 防火墙问题
  > 防火墙的原因外部访问不了服务，解决办法是关掉防火墙，或者开启指定端口（推荐）有关防火墙的操作如下：

```
# 以centos7+为例

# 开关防火墙
systemctl start/stop/restart firewalld.service

#设置开机启用防火墙
systemctl enable firewalld.service
#设置开机不启动防火墙
systemctl disable firewalld.service


# 新增开放一个端口号
firewall-cmd --zone=public --add-port=80/tcp --permanent
#说明:
#–zone #作用域
#–add-port=80/tcp #添加端口，格式为：端口/通讯协议
#–permanent 永久生效，没有此参数重启后失效

#多个端口:
firewall-cmd --zone=public --add-port=80-90/tcp --permanent

#centos7查看防火墙所有信息
firewall-cmd --list-all
#centos7查看防火墙开放的端口信息
firewall-cmd --list-ports

```

- 进程，端口冲突（ps,kill）



## 十一.linux tar命令

常见的压缩命令有一下两种
```
#压缩
tar -czvf ***.tar.gz
tar -cjvf ***.tar.bz2
#解压缩
tar -xzvf ***.tar.gz
tar -xjvf ***.tar.bz2

```
本人最常用的是:
```

tar -czvf ***.tar.gz
tar -xzvf ***.tar.gz
```
他们各个参数的含义是:
- c  ：建立一个压缩档案的参数指令(create 的意思)；

- x  ：解开一个压缩档案的参数指令！

- t  ：查看 tarfile 里面的档案！

特别注意，在参数的下达中， c/x/t 仅能存在一个！不可同时存在！

因为不可能同时压缩与解压缩。

- z  ：是否同时具有 gzip 的属性？亦即是否需要用 gzip 压缩？

- j  ：是否同时具有 bzip2 的属性？亦即是否需要用 bzip2 压缩？

- v  ：压缩的过程中显示档案！这个常用，但不建议用在背景执行过程！

- f  ：使用档名，请留意，在 f 之后要立即接档名喔！不要再加参数！

例如使用『 tar -zcvfP tfile sfile 』就是错误的写法，要写成

『 tar -zcvPf tfile sfile 』才对喔！

- p  ：使用原档案的原来属性（属性不会依据使用者而变）

- P  ：可以使用绝对路径来压缩！

- N  ：比后面接的日期(yyyy/mm/dd)还要新的才会被打包进新建的档案中！

--exclude FILE：在压缩的过程中，不要将 FILE 打包！