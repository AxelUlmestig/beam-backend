IMGNAME="beam-backend"
docker rm -f $IMGNAME
docker rmi $IMGNAME
docker build -t $IMGNAME .
docker run -d --name $IMGNAME $IMGNAME
