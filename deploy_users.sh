set -a
source .env
set +a
export AWS="aws --region $AWS_REGION --profile drfriendless --output text --no-cli-pager"

cp public/*.txt ./dist
# upload files to S3
$AWS s3 cp ./dist/users.txt s3://$LIVE_BUCKET/
$AWS cloudfront create-invalidation --distribution-id E2CKRPUM89UOLP --paths /users.txt