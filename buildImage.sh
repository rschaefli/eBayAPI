#!/bin/bash

usage()
{
  cat <<EOF
usage: $0 options

This script will build an image with the given name from the specified repository.

OPTIONS:
   -r    Repository location
   -i    Image name   
EOF
}

# Parse input arguments
REPOSITORY_NAME=
IMAGE=
while getopts “r:i:” OPTION
do
  case $OPTION in
    r)
      REPOSITORY_NAME=$OPTARG
      ;;
    i)
      IMAGE=$OPTARG
      ;;
    ?)
      usage
      exit
      ;;
  esac
done

if [[ -z $REPOSITORY_NAME ]] || [[ -z $IMAGE ]]
then
  usage
  exit 1
fi


IMAGE_COUNT=`docker images -a | grep $IMAGE| wc -l`
if [ $IMAGE_COUNT -gt 0 ]
then
  echo '['`date`']:' 'Removing existing docker image' $IMAGE
  docker rmi $IMAGE

  if [ ! $? -eq 0 ]
  then
    echo '['`date`']:' 'Failed to remove existing image. Make sure there is no running container using image:' $IMAGE'.'
    exit 1
  fi
fi

echo '['`date`']:' 'Start building Image'
docker build -t $IMAGE $REPOSITORY_NAME
docker images | grep $IMAGE
echo '['`date`']:' 'Image is built [' $IMAGE '] successfully'