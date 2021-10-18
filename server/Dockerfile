FROM node:12

WORKDIR /app

COPY package*.json ./

RUN apt-get update
RUN apt-get -y install gcc g++ python
RUN npm install

COPY . .

ENV PORT=3000 

EXPOSE 3000

CMD ["npm", "start"]
