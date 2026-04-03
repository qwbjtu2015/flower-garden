# 花语花园 🌸

一个美丽的养花指导网站，帮助用户学习如何养护各种花卉。

## 功能特性

### 首页
- 🌺 展示各种花卉卡片
- 🔍 支持搜索花卉名称
- 🏷️ 按分类筛选（灌木花卉、球根花卉、兰科花卉等）
- 📊 按养护难度筛选（简单、中等、困难）

### 花卉详情页
- 🖼️ 高清花卉图片
- 💧 详细的浇水方法
- ☀️ 光照需求
- 🌡️ 温度要求
- 📝 养护技巧
- 🧪 施肥指南（含购买链接）
- 💬 用户评论系统

### 用户系统
- 👤 用户注册和登录
- 🔐 JWT 认证
- 👥 个人中心
- 💬 发表和删除评论

## 技术栈

### 后端
- Node.js + Express
- SQLite (better-sqlite3)
- JWT 认证
- bcryptjs 密码加密

### 前端
- React 18
- React Router 6
- TailwindCSS
- Vite

## 快速开始

### 1. 安装依赖

```bash
# 安装全部依赖
cd flower-garden
npm run install:all
```

或者分别安装：

```bash
# 后端依赖
cd server
npm install

# 前端依赖
cd client
npm install
```

### 2. 启动后端服务器

```bash
cd server
npm run dev
```

后端服务将运行在 http://localhost:3001

### 3. 启动前端开发服务器

```bash
cd client
npm run dev
```

前端服务将运行在 http://localhost:5173

## 项目结构

```
flower-garden/
├── server/
│   ├── db/
│   │   └── database.js      # 数据库初始化和模型
│   ├── middleware/
│   │   └── auth.js          # JWT 认证中间件
│   ├── routes/
│   │   ├── auth.js          # 用户认证路由
│   │   ├── flowers.js       # 花卉API路由
│   │   └── comments.js     # 评论API路由
│   ├── package.json
│   └── server.js            # 服务器入口
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # 页面头部
│   │   │   ├── FlowerCard.jsx       # 花卉卡片组件
│   │   │   └── CommentSection.jsx  # 评论组件
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # 认证上下文
│   │   ├── pages/
│   │   │   ├── Home.jsx            # 首页
│   │   │   ├── FlowerDetail.jsx    # 花卉详情页
│   │   │   ├── Login.jsx           # 登录页
│   │   │   ├── Register.jsx        # 注册页
│   │   │   └── Profile.jsx         # 个人中心
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 花卉
- `GET /api/flowers` - 获取花卉列表（支持分类、难度、搜索筛选）
- `GET /api/flowers/:id` - 获取花卉详情
- `GET /api/flowers/meta/categories` - 获取所有分类

### 评论
- `GET /api/flowers/:flowerId/comments` - 获取花卉评论
- `POST /api/flowers/:flowerId/comments` - 添加评论（需登录）
- `DELETE /api/flowers/comments/:commentId` - 删除评论（需登录）

## 预置花卉数据

网站预置了12种常见花卉的数据：
- 玫瑰、月季、郁金香、兰花
- 向日葵、牡丹、百合、菊花
- 薰衣草、蝴蝶兰、仙客来、绿萝

## 数据库

使用 SQLite 数据库，数据库文件位于 `server/db/flower_garden.db`。首次启动时会自动创建表结构和示例数据。
