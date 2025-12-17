set -a
source .env
set +a
export AWS="aws --region $AWS_REGION --profile drfriendless --output text --no-cli-pager"

# deploy the stack
cdk deploy --profile drfriendless --require-approval never
# tell the Lambdas to refresh from their code source, because CloudFront is too special to do that.
#cd lib
#npx ts-node --prefer-ts-exts ./post-stack.mts
# upload code to S3
$AWS s3 sync ./dist s3://$LIVE_BUCKET/