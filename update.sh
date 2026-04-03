#!/bin/bash

# rebuild
npm run build

# sync AWS
aws s3 sync dist/personal-website/browser/ s3://charlie-clark-personal-website --delete

# invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id ETXVXBJ3AZ32E --paths "/*"

echo ""
echo "Done!"
