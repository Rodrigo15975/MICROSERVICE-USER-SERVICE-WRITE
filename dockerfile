FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 4002

CMD [ "npm","run", "start:prod" ]

