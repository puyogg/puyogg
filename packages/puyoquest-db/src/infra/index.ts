import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { imageCacheBucketName } from '../config.js';

const config = new pulumi.Config();

const bucket = new aws.s3.Bucket(imageCacheBucketName, {
  bucket: imageCacheBucketName,
});
export const bucketName = bucket.bucket;

// a backup of what the allowed IP addresses are
const allowedIPs = new aws.ssm.Parameter('allowed-IPs', {
  type: 'SecureString',
  value: config.requireSecret('PUYOQUEST_DB_ALLOWED_IP'),
});

const vpc = new awsx.ec2.Vpc('puyoquest-db-vpc');
const securityGroup = new aws.ec2.SecurityGroup('puyoquest-db-sg', {
  vpcId: vpc.vpcId,
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      cidrBlocks: allowedIPs.value.apply((v) => v.split(',').map((address) => `${address}/32`)),
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: '-1',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
});

const db = new aws.rds.Instance('puyoquest-db', {
  dbName: 'puyoquest-db',
  instanceClass: 'db.t4g.micro',
  username: config.requireSecret('PUYOQUEST_DB_USER'),
  password: config.requireSecret('PUYOQUEST_DB_PASSWORD'),
  allocatedStorage: 5,
  maxAllocatedStorage: 5,
  allowMajorVersionUpgrade: true,
  backupRetentionPeriod: 7,
  engine: 'postgres',
  engineVersion: '15',
  identifier: 'puyoquest-db',
  vpcSecurityGroupIds: [securityGroup.id],
});
export const dbAddress = db.address;
