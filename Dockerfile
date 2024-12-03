# Sử dụng image Node.js chính thức
FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Tạo thư mục làm việc
WORKDIR /home/app

# Sao chép file cấu hình package.json và package-lock.json
COPY package*.json ./

USER duypv

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY --chown=node:node . .

# Build ứng dụng Next.js
# RUN npm run build

# Mở cổng cho ứng dụng
EXPOSE 3000

# Khởi động ứng dụng ở chế độ production / nhà phát triển
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
