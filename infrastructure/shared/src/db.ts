import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { puyoggVpc } from './vpc.js';

const config = new pulumi.Config();

const allowedIPs = new aws.ssm.Parameter('allowed-IPs', {
  type: 'SecureString',
  value: config.requireSecret('PUYOQUEST_DB_ALLOWED_IP'),
});

const securityGroup = new aws.ec2.SecurityGroup('puyogg-db-sg', {
  vpcId: puyoggVpc.vpcId,
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

const subnetGroup = new aws.rds.SubnetGroup('puyogg-db-sng', {
  subnetIds: puyoggVpc.privateSubnetIds,
  tags: {
    Name: 'Primary puyogg db subnet group',
  },
});

export const db = new aws.rds.Instance('puyoquest-db', {
  dbName: 'ppqdb',
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
  dbSubnetGroupName: subnetGroup.name,
  vpcSecurityGroupIds: [securityGroup.id],
  skipFinalSnapshot: true,
  publiclyAccessible: false,
});
