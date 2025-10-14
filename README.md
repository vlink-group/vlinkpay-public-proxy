# VLinkPay Public Proxy API

REST API được xây dựng bằng Node.js và Express.js với CORS được cấu hình để không chặn cross-origin requests.

## 🚀 Tính năng

- ✅ Express.js REST API
- ✅ CORS enabled (không chặn)
- ✅ Security headers với Helmet
- ✅ Request logging với Morgan
- ✅ Environment configuration
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Sẵn sàng deploy lên Render

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn

## 🛠 Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd vlinkpay-public-proxy
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp .env.example .env
```

4. Chạy ứng dụng:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Base URL
- Local: `http://localhost:3000`
- Production: `https://your-app.onrender.com`

### Endpoints

#### 1. Root endpoint
```
GET /
```
Trả về thông tin cơ bản về API.

#### 2. Health check
```
GET /health
```
Kiểm tra trạng thái sức khỏe của API.

#### 3. API Status
```
GET /api/v1/status
```
Trả về trạng thái API chi tiết.

#### 4. Proxy Info
```
GET /api/v1/proxy-info
```
Thông tin về cấu hình CORS và proxy.

#### 5. Test endpoint
```
POST /api/v1/test
Content-Type: application/json

{
  "message": "test data"
}
```

#### 6. VLinkExchange Market Info
```
GET /api/v1/exchange/market/info
```
Fetch active markets từ VLinkExchange API (limit 500).

#### 7. Proxy endpoint (mẫu)
```
POST /api/v1/proxy
Content-Type: application/json

{
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  },
  "body": {}
}
```

## 🌐 CORS Configuration

API được cấu hình để cho phép tất cả cross-origin requests:
- **Origin**: `*` (tất cả domains)
- **Methods**: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- **Headers**: `Content-Type, Authorization, X-Requested-With`

## 🚀 Deploy lên Render

### Bước 1: Chuẩn bị
1. Push code lên GitHub repository
2. Đăng nhập vào [Render](https://render.com)

### Bước 2: Tạo Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Chọn repository `vlinkpay-public-proxy`

### Bước 3: Cấu hình
- **Name**: `vlinkpay-public-proxy`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (hoặc theo nhu cầu)

### Bước 4: Environment Variables
Thêm các biến môi trường (nếu cần):
```
NODE_ENV=production
PORT=10000
```

### Bước 5: Deploy
Click "Create Web Service" và đợi deploy hoàn tất.

## 📦 Dependencies

### Production
- `express`: Web framework
- `cors`: CORS middleware
- `helmet`: Security headers
- `dotenv`: Environment configuration
- `morgan`: HTTP request logger
- `axios`: HTTP client cho external API calls

### Development
- `nodemon`: Auto-restart server

## 🔧 Customization

### Thêm routes mới
Tạo file trong thư mục `routes/` và import trong `server.js`:

```javascript
app.use('/api/v1/new-feature', require('./routes/new-feature'));
```

### Cấu hình CORS chi tiết
Trong `server.js`, thay thế:
```javascript
app.use(cors()); // Cho phép tất cả

// Bằng:
app.use(cors({
  origin: ['https://yourdomain.com', 'https://anotherdomain.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📝 License

ISC