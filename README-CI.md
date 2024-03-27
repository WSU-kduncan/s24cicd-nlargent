# Project 4

## CI Project Overview
- What: Containerize an application with Docker.

- Why: For the application to have all dependencies ready, file system isolation and scalability of the application. Also the practice with Docker/containers.

- What tools: Docker Desktop, apache2, WSL, website.


## How To Run Project Locally
- Docker desktop for Windows needs to be installed and running. The installer can be found on [Docker's Website](https://www.docker.com/products/docker-desktop/)

- Windows Subsystem for Linux (WSL) was used to work with Docker Desktop. To install WSL, follow [Microsoft Docs](https://learn.microsoft.com/en-us/windows/wsl/install)


### How To Build An Image From The Dockerfile
- docker build . -t nlp4:latest

- You can change the name of the tag if you want. If you do, make sure it matches with the next step

### How To Run The Container
- docker run -d --rm --name webserv -p 80:80 nlp4:latest

- "--rm" can be omittied if you do not want to remove the container after exit 
- Also you can change the name after the --name tag

### How To View The Project Running
- Open a browser on the host, type in the address bar "localhost" without quotes and press enter.

### How To Stop The Container
- docker stop webserv




