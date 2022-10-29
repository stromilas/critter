#!/bin/bash

set -euo pipefail

# Variables:
. variables.sh

# Create S3 bucket for CloudFormation sub-templates
echo "Creating S3 bucket and uploading sub-templates"
aws s3 mb s3://${BUCKET}

# Upload templates to S3
aws s3 cp ./ s3://${BUCKET}/templates --recursive

# Deploy Quick Start CloudFormation stack
echo "Deploying CloudFormation stack"

aws cloudformation deploy \
    --template-file ./stack.yml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides AppName=${STACK_NAME} \
                          Stage=${STAGE} \
                          TemplateBucket=${BUCKET} \
                          CidrBlock=${CIDR}

echo "Deploy successful"


