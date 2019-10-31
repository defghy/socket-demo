# Smart Hotel Demo

## 文档
https://qails.github.io

## 前提
1. node 7.6+
2. npm 3+
3. yarn & pm2

  ```
  npm install -g --registry https://registry.npm.taobao.org yarn pm2
  ```

## 安装
1. 安装依赖包

  ```
  yarn
  ```
2. 启动工程

  ```
  yarn start
  ```

## pm2 命令
```
# 看日志
pm2 logs

# 删除所有服务
pm2 delete all
```  

如果是在服务器上，需要指定工作目录

```
HOME=/root sudo pm2 logs
HOME=/root sudo pm2 delete all
```

更多请查看官方网站： http://pm2.keymetrics.io/

## 用 yarn 代替 npm 的说明
1. yarn 会缓存安装结果，以后安装会更快。
2. yarn 安装后会生成 `yarn.lock`，这个文件记录了每个包的版本和位置，起到了版本锁定的作用。
3. 最好使用下面的命令来修改依赖包，它会同步更新 `yarn.lock`

  ```
  yarn add xxx
  yarn add xxx@xxx
  yarn remove xxx
  ```
4. 当 `yarn.lock` 比较乱时，可以重新生成一份

  ```
  rm -rf node_modules yarn.lock && yarn
  ```
