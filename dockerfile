FROM mhart/alpine-node

LABEL author="msheldon83@gmail.com"

RUN mkdir src
COPY . /src
WORKDIR /src
RUN npm install -g webpack
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]


