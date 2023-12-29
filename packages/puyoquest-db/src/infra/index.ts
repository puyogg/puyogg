import * as aws from '@pulumi/aws';
import { imageCacheBucketName } from '../config.js';

export const bucket = new aws.s3.Bucket(imageCacheBucketName, {
  bucket: imageCacheBucketName,
});
