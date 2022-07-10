FROM node:14.17.3
WORKDIR /app
# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

COPY package.json ./
COPY . .
RUN npm install
EXPOSE 5000
CMD /wait && npm start


