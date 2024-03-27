FROM ubuntu:22.04

# install dependencies
RUN apt update -y
RUN apt upgrade -y
RUN apt install apache2 -y

# set a directory for the app
WORKDIR /var/www/html

# copy all the files to the container
COPY website/TicTacToe/public/index.html .
COPY website/TicTacToe/public/404.html .
COPY website/TicTacToe/public/styles ./styles
COPY website/TicTacToe/public/scripts ./scripts

# tell the port number the container should expose
EXPOSE 80

# run the command
CMD ["/etc/init.d/apache2", "start"]

