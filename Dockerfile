FROM node:10.16.3-buster-slim

COPY . /opt
WORKDIR /opt
RUN npm install
ENV CHAT_URL=http://pdj01.poraodojuca.net:3000/iframe.html
CMD ["npm", "start"]
