# Sử dụng image Node.js chính thức
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép file cấu hình package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Khởi động ứng dụng ở chế độ production / nhà phát triển
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]

# Mở cổng cho ứng dụng
EXPOSE 3000
