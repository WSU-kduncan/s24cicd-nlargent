FROM ubuntu:22.04

# install dependencies
RUN apt update -y
RUN apt upgrade -y
RUN apt install apache2 systemctl -y

# set a directory for the app
WORKDIR /var/www/html

# copy all the files to the container
COPY TicTacToe/public/index.html .
COPY TicTacToe/public/404.html .
COPY TicTacToe/public/styles ./styles
COPY TicTacToe/public/scripts ./scripts

# tell the port number the container should expose
EXPOSE 80

# run the command
CMD ["systemctl", "start", "apache2"]

