# Hướng dẫn Deploy lên Render

## 🚀 Cách 1: Deploy qua Dashboard

### Bước 1: Chuẩn bị Repository
1. Push tất cả code lên GitHub:
```bash
git add .
git commit -m "Initial REST API setup with CORS enabled"
git push origin main
```

### Bước 2: Tạo Web Service trên Render
1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect với GitHub repository của bạn
4. Chọn repository `vlinkpay-public-proxy`

### Bước 3: Cấu hình Service
- **Name**: `vlinkpay-public-proxy`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` hoặc `Singapore` 
- **Branch**: `main` (hoặc branch hiện tại)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Bước 4: Advanced Settings
**Environment Variables:**
```
NODE_ENV=production
```

**Instance Type:**
- Free tier: `Free` (512 MB RAM, shared CPU)
- Paid: `Starter` ($7/month, 512 MB RAM, 0.1 CPU)

### Bước 5: Deploy
1. Click **"Create Web Service"**
2. Đợi quá trình build và deploy (khoảng 2-5 phút)
3. Service sẽ có URL dạng: `https://vlinkpay-public-proxy.onrender.com`

## 🛠 Cách 2: Deploy qua Render.yaml

### Bước 1: Sử dụng file render.yaml có sẵn
File `render.yaml` đã được tạo sẵn trong project.

### Bước 2: Deploy
1. Trong Render Dashboard, click **"New +"** → **"Blueprint"**
2. Connect repository và chọn `render.yaml`
3. Review cấu hình và click **"Apply"**

## ✅ Kiểm tra sau khi Deploy

### 1. Endpoints để test:
- **Root**: `https://your-app.onrender.com/`
- **Health**: `https://your-app.onrender.com/health`
- **API Status**: `https://your-app.onrender.com/api/v1/status`

### 2. Test CORS:
```bash
curl -i -H "Origin: https://example.com" https://your-app.onrender.com/
```

Phản hồi phải có headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

### 3. Test POST với JSON:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://example.com" \
  -d '{"message": "test"}' \
  https://your-app.onrender.com/api/v1/test
```

## 🔧 Cấu hình nâng cao

### Custom Domain
1. Trong service settings → **"Custom Domains"**
2. Add domain của bạn
3. Cập nhật DNS records theo hướng dẫn

### Environment Variables
Thêm các biến môi trường cần thiết:
```
NODE_ENV=production
API_KEY=your-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### Auto-Deploy
- Render sẽ tự động deploy khi có push mới lên branch
- Có thể tắt auto-deploy trong settings nếu cần

## 🚨 Lưu ý quan trọng

### Free Tier Limitations:
- Service sẽ "sleep" sau 15 phút không hoạt động
- Thời gian khởi động lại: 30 giây - 1 phút
- Bandwidth: 100GB/month
- Build minutes: 500 phút/month

### CORS Configuration:
- API đã được cấu hình để **không chặn** CORS
- Cho phép tất cả origins (`*`)
- Hỗ trợ tất cả HTTP methods chuẩn
- Preflight requests được xử lý tự động

### Monitoring:
- Logs: Xem trong Render dashboard → Service → Logs
- Metrics: Dashboard → Service → Metrics
- Alerts: Có thể setup email alerts cho downtime

## 🔗 Useful Links
- [Render Documentation](https://render.com/docs)
- [Render Status Page](https://status.render.com/)
- [Render Community](https://community.render.com/)

## 📞 Support
Nếu gặp vấn đề khi deploy, kiểm tra:
1. Logs trong Render dashboard
2. GitHub repository có đầy đủ files
3. package.json có đúng start script
4. Port được lấy từ `process.env.PORT`