FROM node:16

WORKDIR /usr/src/app

COPY package.json .
RUN npm i

COPY . ./
RUN npm run build

EXPOSE $PORT
CMD ["npm", "start"]
