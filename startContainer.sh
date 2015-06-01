#!/bin/bash

usage()
{
  cat <<EOF
usage: $0 options

This script will start a container from the given image and repository.

OPTIONS:
   -r Repository_Location   Location of the repository used to start your container
   -i Image_Name            Name of the image you are starting the container from
   -c Container_Name        Name to give the container
EOF
}

# Parse input arguments
REPOSITORY_NAME=
IMAGE_NAME=
CONTAINER_NAME=
while getopts “r:i:c:” OPTION
do
  case $OPTION in
    r)
      REPOSITORY_NAME=$OPTARG
      ;;
    i)
      IMAGE_NAME=$OPTARG
      ;;
    c)
      CONTAINER_NAME=$OPTARG
      ;;
    ?)
      usage
      exit
      ;;
  esac
done

if [[ -z $REPOSITORY_NAME ]] || [[ -z $IMAGE_NAME ]] || [[ -z $CONTAINER_NAME ]]
then
  usage
  exit 1
fi

# Actually run the script with additional arguments
docker run -d -t --name $CONTAINER_NAME \
  -v ${REPOSITORY_NAME}/container/startup.sh:/opt/app/startup.sh \
  $IMAGE_NAME

# Did the container start successfully?
if [ $? -eq 0 ]
then
  echo '['`date`']:' 'Container started successfully'
  exit 0
else
  echo '['`date`']:' 'Container failed to start. Please investigate.'
  exit 1
fi
