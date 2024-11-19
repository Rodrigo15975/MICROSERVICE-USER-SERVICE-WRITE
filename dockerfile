# Usa una imagen base de Node.js
FROM node:20-alpine3.20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json al contenedor
COPY package*.json ./

RUN npm install
COPY prisma prisma
COPY . .


COPY wait-for-db.sh .

EXPOSE 4002



CMD ["sh","./wait-for-db.sh"]

