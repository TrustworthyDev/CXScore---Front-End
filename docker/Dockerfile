FROM node:18-bullseye 

COPY main-ui ./main-ui
ENV PATH /main-ui/node_modules/.bin:$PATH

WORKDIR /main-ui
RUN yarn install
RUN yarn build --mode production

CMD yarn preview --host 
