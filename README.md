steps
docker pull mongo
docker pull mongo:4.0.4
docker run --name mongodb mongo:4.0.4
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4
docker exec -it mongodb bash
mongo
exit
exit
