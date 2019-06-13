FROM nginx:1.15
LABEL maintainer="xinghua 764237865@qq.com"
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/
COPY ./dist/ /usr/share/nginx/html/
