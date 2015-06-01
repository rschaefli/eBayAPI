#!/bin/bash
EXECUTE_CMD='/bin/bash'

usage()
{
  cat <<EOF
usage: $0 options

This script will enter a container with the given name.

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

docker exec -i -t $CONTAINER $EXECUTE_CMD
