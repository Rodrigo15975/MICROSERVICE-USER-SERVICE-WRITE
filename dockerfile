FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./

# cambiar todo
RUN npm install
COPY prisma prisma
COPY . .


COPY wait-for-db.sh .

EXPOSE 4002


CMD ["sh","./wait-for-db.sh"]

