# specify the node base image with your desired version node:<version>
FROM mhart/alpine-node

LABEL author="msheldon83@gmail.com"

RUN mkdir src
COPY . /src
WORKDIR /src
RUN npm install -g webpack
RUN npm install

# replace this with your application's default port
EXPOSE 3000

CMD ["npm", "start"]


