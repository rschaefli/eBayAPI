#!/bin/bash

usage()
{
  cat <<EOF
usage: $0 options

This script will stop a container with the given name.

OPTIONS:
   -c    Container name   
EOF
}

# Parse input arguments
CONTAINER=
while getopts “c:” OPTION
do
  case $OPTION in
    c)
      CONTAINER=$OPTARG
      ;;
    ?)
      usage
      exit
      ;;
  esac
done

if [[ -z $CONTAINER ]]
then
  usage
  exit 1
fi


####
# Here is where we can run a shutdown script to stop the container process gracefully
####
COUNT=`docker ps | grep ${CONTAINER} | wc -l`
if [ ! $COUNT -gt 0 ]
then
  echo '['`date`']:' 'Container' $CONTAINER 'is not running, removing...'
  #docker exec -i -t ${CONTAINER} ${SHUTDOWN_SCRIPT}
else
  echo '['`date`']:' 'Stopping container' ${CONTAINER}
  docker stop ${CONTAINER}
fi

COUNT=`docker ps -a | grep $CONTAINER | wc -l`
if [ $COUNT -gt 0 ]
then
  echo '['`date`']:' 'Removing container' ${CONTAINER}
  docker rm ${CONTAINER}
else
  echo '['`date`']:' 'Container' ${CONTAINER} 'not found.'
  exit
fi

echo '['`date`']:' 'Container' ${CONTAINER} 'stopped and removed successfully'