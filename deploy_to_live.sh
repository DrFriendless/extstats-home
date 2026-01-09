set -a
source .env
set +a
export AWS="aws --region $AWS_REGION --profile drfriendless --output text --no-cli-pager"

# deploy the stack
cdk deploy --profile drfriendless --require-approval never
# upload files to S3
$AWS s3 sync ./dist s3://$LIVE_BUCKET/