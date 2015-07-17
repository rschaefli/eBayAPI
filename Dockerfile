FROM ubuntu:14.10
MAINTAINER Ricardo Schaefli

# Install nginx
RUN apt-get update && apt-get install -y \
  git \
  npm \  
  nodejs

# Set time zone to match host
RUN rm /etc/localtime && ln -s /usr/share/zoneinfo/US/Pacific /etc/localtime && date

EXPOSE 8080
ENTRYPOINT ["/bin/bash", "/opt/ebayapi/startup.sh"]