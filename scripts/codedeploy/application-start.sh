#!/bin/bash

AWS_REGION=
CONFIG_BUCKET=
ECR_REPOSITORY_URI=
GIT_COMMIT=

INSTANCE=$(curl -s http://instance-data/latest/meta-data/instance-id)
CONFIG=$(aws --region $AWS_REGION ec2 describe-tags --filters "Name=resource-id,Values=$INSTANCE" "Name=key,Values=Configuration" --output text | awk '{print $5}')

(aws s3 cp s3://$CONFIG_BUCKET/florence/$CONFIG.asc . && gpg --decrypt $CONFIG.asc > $CONFIG) || exit $?

source $CONFIG && docker run -d                \
  --env=BABBAGE_URL=$BABBAGE_URL               \
  --env=ZEBEDEE_URL=$ZEBEDEE_URL               \
  --env=TABLE_RENDERER_URL=$TABLE_RENDERER_URL \
  --name=florence                              \
  --net=publishing                             \
  --restart=always                             \
  $ECR_REPOSITORY_URI/florence:$GIT_COMMIT
