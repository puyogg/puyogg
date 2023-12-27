// import '@puyogg/puyoquest-db/infra';

import * as aws from '@pulumi/aws';

const bucket = new aws.s3.Bucket('test-bucket');

export const bucketName = bucket.id;
