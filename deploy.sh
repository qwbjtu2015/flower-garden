#!/bin/bash
# flower-garden 一键部署脚本
# 用法: bash deploy.sh

set -e

echo "🌸 开始部署花语花园..."

# 1. 安装依赖
echo "📦 安装系统依赖..."
sudo apt update
sudo apt install -y nodejs npm nginx

# 2. 创建应用目录
echo "📁 创建目录..."
sudo mkdir -p /var/www/flower-garden
sudo chown $USER:$USER /var/www/flower-garden

# 3. 复制项目文件（需要先把项目放到这个目录）
echo "📂 请将项目文件复制到 /var/www/flower-garden"
echo "   然后按回车继续..."
read

cd /var/www/flower-garden

# 4. 安装后端依赖
echo "🔧 安装后端依赖..."
cd server
npm install --production

# 5. 安装前端依赖并构建
echo "🎨 构建前端..."
cd ../client
npm install
npm run build

# 6. 配置 PM2
echo "⚡ 配置 PM2..."
npm install -g pm2
cd ../server
pm2 start server.js --name flower-api
pm2 startup
pm2 save

# 7. 配置 Nginx
echo "🌐 配置 Nginx..."
sudo tee /etc/nginx/sites-available/flower-garden > /dev/null <<EOF
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    client_max_body_size 10M;

    # 前端静态文件
    location / {
        root /var/www/flower-garden/client/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/flower-garden /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ 部署完成！"
echo ""
echo "📝 请配置你的域名 DNS 指向此服务器 IP"
echo "🌐 访问 http://YOUR_SERVER_IP 即可使用"
echo ""
echo "📌 常用命令："
echo "   pm2 logs flower-api    # 查看后端日志"
echo "   pm2 restart flower-api # 重启后端"
echo "   sudo nginx -t          # 检查 Nginx 配置"
echo "   sudo systemctl restart nginx  # 重启 Nginx"
