# 项目简介
【小苍兰电子书管理系统】是我个人的第2个开源全栈项目，这是后端部分。基于 NestJS 从 0 到 1 实现了后端的三大核心功能模块：注册登录、权限管理、图书管理。前端部分基于 vben admin 框架二次开发，快速搭建页面

前端项目仓库：https://gitee.com/adamswan/Freesia_Ebook_FrontEnd

# 技术栈
NestJS、NestJS CLI、TypeORM、MySQL、fs-extra、adam-zip、compressing、winston 等

# 功能与实现
基于 Restful API 风格，开发了 39 个接口，涵盖各个功能模块的新增、删除、修改、查询（分页+关键词）

## 登录注册
登录模块集成 JWT ，利用全局守卫 AuthGuard 验证用户身份信息，结合自定义装饰器忽略公共接口的 token 校验

## 权限管理
基于 RBAC 模型，设计并开发了权限管理模块，通过为不同角色分配不同的权限，实现了对用户权限细颗粒度的控制。主要分为用户管理、角色管理、菜单管理、功能权限管理，通过分表与字段关联查询实现路由级别、菜单级别的权限控制，通过角色守卫 RoleGuard 实现接口级别的权限控制

## 电子书管理
使用文件拦截器 FileInterceptors 结合装饰器 UploadedFile 、Nginx，实现 .epub 电子书文件的上传与存储，并通过自定义管道 ParseFilePipeBuilder 校验上传文件；基于 fs-extra 拷贝插件、adam-zip 解压插件等，设计并实现了 ParseEpubBook 类，解决 .epub 文件的解析问题；基于 compressing 库提供的 Stream 对象，实现了电子书文件的流式下载

## 其他
利用响应拦截器 Interceptors 格式化响应报文，通过全局异常过滤器 ExceptionFilter 捕获错误，并结合 winston 相关插件将异常日志存储为 .log 文件