FROM node:8.11.2
MAINTAINER Frueh Loïc <loic.frueh@heig-vd.ch>

ADD src /opt/app/
WORKDIR /opt/app/

RUN npm install

ENTRYPOINT ["node", "/opt/app/musician.js"]