FROM node:12

ADD ./.profile.d /app/.profile.d
WORKDIR /app

COPY package*.json ./

RUN apt-get update
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get -y install gcc g++ python
RUN npm install

COPY . .

ENV PORT=3000 

EXPOSE 3000

CMD ["npm", "start"]
