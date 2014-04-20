# Pull base image.
FROM howtox/node_base

# https://github.com/Krijger/docker-cookbooks/blob/master/supervisor/Dockerfile
# install supervisor (which has no package on 12.04) to manage our processes
# the supervisor config file is more likely to change and is therefore added as a later step

RUN apt-get -y install python-setuptools

# Need make
RUN apt-get install -y build-essential

RUN easy_install supervisor
RUN mkdir -p /var/log/supervisor
# create directory for child images to store configuration in
RUN mkdir -p /etc/supervisor/conf.d
ADD ./srv/howtox/supervisord.conf /etc/supervisord.conf

ENV HOME /root
WORKDIR /root

# Add scripts
ADD ./root /root
ADD ./srv /srv
RUN chmod +x /srv/howtox/docker_start.sh

# for /root
RUN git clone https://github.com/shaohua/phaser-101.git /root/phaser-101

# for /srv/howtox
{{preBuildHook}}
RUN git clone https://github.com/shaohua/cloud9.git /srv/howtox/cloud9
RUN cd /srv/howtox/cloud9 && npm install
RUN cd /srv/howtox && npm install tty.js
{{postBuildHook}}

EXPOSE 3131 8000 8001
CMD ["/usr/local/bin/supervisord"]

