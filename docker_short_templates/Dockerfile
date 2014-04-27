# Pull base image.
FROM howtox/yc_base
ENV HOME /root
WORKDIR /root

# for /root
RUN git clone https://github.com/{{userName}}/{{repoName}}.git /root/{{repoName}}

EXPOSE 3131 3132 3133
CMD ["/usr/local/bin/supervisord"]