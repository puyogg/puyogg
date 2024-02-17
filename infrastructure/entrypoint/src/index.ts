import './pulumi.js';
import './github.js';
export * as puyoquestApi from '@puyogg/puyoquest-api/infra';

export * as shared from '@puyogg/infra-shared';

import * as aws from '@pulumi/aws';
const bucket = new aws.s3.Bucket('test-bucket');

export const bucketName = bucket.id;
