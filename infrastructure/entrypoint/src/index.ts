import '@puyogg/puyoquest-db/infra';

import './pulumi.js';
import './github.js';
export * as puyoquestApi from '@puyogg/puyoquest-api/infra';
export * as puyoquestDb from '@puyogg/puyoquest-db/infra';

import * as aws from '@pulumi/aws';

const bucket = new aws.s3.Bucket('test-bucket');

export const bucketName = bucket.id;
