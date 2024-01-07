/**
 * Creates Pulumi CI/CD Role
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { AWS_ACCOUNT_ID } from './constants.js';
import { provider as GitHubOIDCProvider } from './github.js';

const user = new aws.iam.User('cicdUser', {
  name: 'cicd-bot',
  tags: {
    purpose: 'Account used to perform Pulumi stack updates on CI/CD.',
  },
});

const group = new aws.iam.Group('pulumiStackUpdaters', {
  name: 'PulumiStackUpdaters',
});

const groupMembership = new aws.iam.GroupMembership('cicdUserMembership', {
  group: group.name,
  users: [user.name],
});

const currentAwsIdentity = await aws.getCallerIdentity();

const groupPolicy = new aws.iam.GroupPolicy('pulumiStackUpdatersPolicy', {
  group: group.name,
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['sts:AssumeRole'],
        Effect: 'Allow',
        Resource: pulumi.interpolate`arn:aws:iam::${currentAwsIdentity.accountId}:role/*`,
        Sid: '',
      },
    ],
  },
});

const role = new aws.iam.Role(
  'PulumiRole',
  {
    name: 'PulumiRole',
    description: 'Pulumi AWS Role for updating stacks',
    assumeRolePolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            // AWS: `arn:aws:iam::${AWS_ACCOUNT_ID.PUYOGG_DEV}:root`,
            Federated: GitHubOIDCProvider.arn,
          },
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': 'repo:puyogg/puyogg:*',
            },
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            },
          },
        },
      ],
    },
  },
  { dependsOn: GitHubOIDCProvider },
);

const policyAttachments = [
  'arn:aws:iam::aws:policy/AmazonECS_FullAccess',
  'arn:aws:iam::aws:policy/IAMFullAccess',
  'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess',
  'arn:aws:iam::aws:policy/AmazonRDSFullAccess',
  'arn:aws:iam::aws:policy/AmazonS3FullAccess',
  'arn:aws:iam::aws:policy/AWSLambda_FullAccess',
  'arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator',
  'arn:aws:iam::aws:policy/AmazonSSMFullAccess',
].map((arn) => {
  const name = `PulumiPolicy_${arn.split('/')[1]}`;
  return new aws.iam.PolicyAttachment(name, {
    roles: [role],
    policyArn: arn,
  });
});
