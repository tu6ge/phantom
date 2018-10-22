FROM wernight/phantomjs:2.1.1

USER root

RUN mkdir -p /usr/share/fonts/truetype/winFont
COPY ./msyh.ttc /usr/share/fonts/truetype/winFont

RUN apt-get update \
	&& apt-get install -y fontconfig \
	&& fc-cache

USER phantomjs
VOLUME /home/phantomjs/
WORKDIR /home/phantomjs/
EXPOSE 9876

CMD ["phantomjs","server.js","9876"]
