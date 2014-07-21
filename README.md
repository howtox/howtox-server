#howtox-server

## Run in production
```
  NODE_ENV=production node app.js
```

## Intro
An node app that converts incoming HTTP requests to Docker command, run those command through ```docker run```, and returns a webpage with a cloud-IDE and a cloud-terminal.

## Disclaimer
NOT secure due to docker needs ROOT access. Read more from [Docker](https://docs.docker.com/articles/security/)
> Running containers (and applications) with Docker implies running the Docker daemon. This daemon currently requires root privileges, and you should therefore be aware of some important details.

## Set up your own CloudIDE service
- Create a [DigitalOcean droplet with ref code](https://www.digitalocean.com/?refcode=24bf100573ba)
- Choose 'Docker on Ubuntu' under 'Select Image'->'Applications'. see ![screenshot](http://imgur.com/rw7TlGZ.png)
- Set up the droplet as usual
- Clone down this repo
- Set up this repo

## How this works at a high level
- Assuming your droplet can be accessed by ```azat.howtox.com```
- Assuming the docker image ```howtox/express``` already exist on your droplet
- The user clicks azat.howtox.com:3000/launch/howtox/express
- Express.js run this command
```
docker run -d -p 63814:3131 -p 63815:3132 -p 63816:3133 howtox/azat-express /usr/local/bin/supervisord
```
- Express.js then redirect the user to azat.howtox.com:3000/box/63814, and present the user with the following HTML
```
#first iframe is the editor
<iframe src="//azat.howtox.com:63814">
#second iframe is the terminal
<iframe src="//azat.howtox.com:63815">
```

## How to setup the droplet
- Make sure you picked the correct image 'Docker on Ubuntu'
```
apt-get update
apt-get upgrade
apt-get install nodejs
apt-get install npm
ln -s `which nodejs` /usr/local/bin/node
cd /home
git clone https://github.com/howtox/howtox-server
#
#add env
#
vi ~/.bashrc
export p_analytics_secret='secret_write_key_from_segment.io'
export EDITOR=vi
```
- Basically, you want to set up node.js and some environment variables. The other way to set up node/npm is using nvm.

## Pull docker images to the droplet
```
docker pull howtox/yc_base
```

## Side note - make a docker image with [Docker Automated Build](http://docs.docker.com/docker-hub/builds/)
### Let's try to make a howtox-compatible Docker image from scratch
- Get the url for the repo of interest. In my case, https://github.com/howtox/express.
- In your droplet
```
cd /home/howtox-server/controllers
node cmd.js howtox/express
```
- Verify the image has been built by
```
docker images | grep 'howtox/express'
```


### Troubleshoot
#### howtox-tty.js failed
```
npm install howtox-tty.js
```
- might need [xcode command line tool](https://github.com/atom/terminal/issues/28#issuecomment-39405908)
