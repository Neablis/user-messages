# Dockerfile
FROM node:12.16.2
WORKDIR '/var/www/app'

ADD start.sh /var/www/app/start.sh
ADD package.json /var/www/app/package.json


# Entry point
RUN ["/var/www/app/start.sh"]
