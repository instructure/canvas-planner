FROM instructure/node:7.5-yarn
ENV APP_HOME /usr/src/app
USER root

RUN mkdir -p $APP_HOME

COPY package.json $APP_HOME/
COPY yarn.lock $APP_HOME/

WORKDIR $APP_HOME

RUN yarn

COPY . $APP_HOME
