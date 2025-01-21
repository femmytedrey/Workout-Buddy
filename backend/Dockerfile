FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash

COPY package.json .

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]