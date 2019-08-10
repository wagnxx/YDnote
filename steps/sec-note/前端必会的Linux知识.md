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
- 适合开发的  Linux
- 非常好用的 MacOS

2. Ubuntu，centos，Redhat，Fedora，debian哪个好
-  桌面版推荐 fedora，Ubuntu
-  其他 推荐  centos
## 三. 远程登录Linux
1. Windows下使用的工具
-  putty，xshell，cmder（cmder下可以使用ssh）
2. Linux 和MacOS下
-  ssh命令

## 四. 常用的Linux命令
1. 行编辑器： vi/vim
2. 服务管理命令：systemctl
> Windows下叫服务，linux下叫守护进程，其自命令有：
- start，stop，restart
- enable/ disable
> 当httpd和nginx起冲突时，可以禁掉httpd；
systemctl disable httpd

3. 网络管理命令
- ifconfig
- ip
- route
4. 命令行下载工具
- wget，wget -c  （参数c代表断点续传）
- curl 较为复杂，后续学习
5. Linux帮助命令
- man   （man wget）
## 五. linux进程管理
1. top命令，查看比较异常的命令
2. ps ，查看进程的命令
> 当前用户不是root时需加 sudo，不然只会显示当前用户的进程，用法：
ps aux | grep node
3. kill,pkill命令 ,向linux内核发送命令
- kill pid (pid为进程号，尽量选小，一般小的表示为主进程，因为如果是子进程的话有可能杀不干净)
- pkill panme （pname为进程名字）
- kill -9 （9号命令表示关闭）
4. w ，查看谁在当前系统上

## 六. Linux网络管理
1. 查看和配置网络的基本信息 ifconfig，ip
2. 重启网卡 ？（在前部分）
3. 怎样找到占用网络端口的进程
- ss
- netstat
- lsof
- 找到冲突后 配合systemctl解决

## 七. 进程，线程，协程
> 在linux系统中，不能把一切文件都笼统称为程序，严格意义上的程序是什么？____?;
- 代码流程
> 源代码---> 可执行文件 ---> 进程；
从以上步骤可知：进程本质上是 可执行文件映射到内存中，CPU逐条执行这些指令，便产生了进程，进程是一个动态的概念
- 操作系统 
> 操作系统是对硬件资源的一种调度，硬件资源是指cpu，内存等
- 官方概念解析
1. 进程：操作系统执行任务的调度单位，目的是担当分配系统资源（CPU时间，内存）的实体
2. 线程： 操作系统调度的最小单位 （早起的linux操作系统是没有线程的，只有进程，其替代方案是多任务，即同事运行多个进程，由一个主进程管理多个子进程）；线程产生的原因是进程本身非常重，每fork一次将会把主进程的所有代码空间和书架复制过去，造成内存资源的浪费，于是此时轻量级的线程
> 线程产生后，线程会共享进程中的内存空间（具体为 数据和部分代码空间），因此会瘦身；
一个进程跑起以后，里面必须有一个主线程，这样进程就依赖于这个主线程的运行，主线程一旦退出，进程一般也会跟着退出（除非是代码层面的阻止退出进程或者脱离进程）；
当程序退出的时候，调用了内核的api
3. 一种用户态轻量级线程，无法利用多核资源
4. cpu 密集型应用发展
- 多进程--> 多线程
- 多数桌面应用都是CPU密集型的，有个特点就是运算量大，长期占用内存空间
5. IO密集型应用发展
- 多进程，多线程 ，事件驱动， 携程
- 多进程，多线程，用户不能控制，切换时由操作系统来完成
- 事件驱动，主要解决同步问题
- 协程 ，可以由程序控制切换，自己掉自己，灵活性提高了
6. 调度和切换时间
- 进程 > 线程 > 携程
## 八.进程与线程细述
1. 进程和线程的资源共享
> 在linux中，所有的设备都是文件，打开一个文件时需要用文件句柄（也叫文件描述符），关闭时被回收
2. 详情
- 资源共享主要有（代码，书架，文件，寄存器，栈）
- 主进程fork时需要copy 代码，数据，文件，寄存器，栈
- 生成一个线程时只需要有自己的寄存器和栈即可
- 协程和线程结构类似，只是它为用户态，操作系统不知道携程，所以不能操作协程
## 九. linux免密登录

> 主要步骤为，生成秘钥，上传公钥到服务器，配置本地文件
1. 生成密钥对
```
    ssh keygen  -t rsa   -C 'wang@qq.com'  -f  'wang_rsa'
// 其中  参数  t为加密方式，C为写到秘钥中的名字，f为生成的秘钥文件名

````

2. 上传公钥

```
    ssh-copy-id -i '公钥文件名'  用户名@ip
    // 输入以上命令后会将公钥导入到  .ssh/authorizd-keys文件中去

```
3. 免密登录功能在本地的配置
- 在 ～/.ssh/config中编辑（没有该文件，自行创建即可）

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
- 配置config的访问权限为 644
























