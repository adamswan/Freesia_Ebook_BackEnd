# 项目简介
【小苍兰电子书管理系统】是我个人的第2个开源全栈项目，这是后端部分。基于 NestJS 从 0 到 1 实现了后端的三大核心功能模块：注册登录、权限管理、图书管理。前端部分基于 vben admin 框架二次开发，快速搭建页面。

# 技术栈
NestJS、NestJS CLI、TypeORM、MySQL、fs-extra、winston 等

# 功能与实现
## 登录注册
1. 登录模块集成 JWT ，利用全局守卫 Guard 验证用户身份信息，结合自定义装饰器忽略公共接口的 token 校验。

## 权限管理
菜单管理、用户管理、角色管理、功能权限管理

## 图书管理
电子书的上传、解析、流式下载

## 其他
日志 集成winston
使用响应拦截器 Interceptors 格式化响应报文
接口数量