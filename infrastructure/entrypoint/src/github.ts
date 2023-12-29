/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from '@pulumi/aws';

const provider = new aws.iam.OpenIdConnectProvider('GitHubOIDC', {
  url: 'https://token.actions.githubusercontent.com',
  clientIdLists: ['sts.amazonaws.com'],
  thumbprintLists: [
    '6938fd4d98bab03faadb97b34396831e3780aea1',
    '1c58a3a8518e8759bf075b76b750d4f2df264fcd',
  ],
});

const role = new aws.iam.Role('GitHubActionsAwsOIDCConnect', {
  name: 'GitHubActionsAwsOIDCConnect',
  description: 'Allows GitHub Actions workflows to assume AWS permissions',
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Federated: provider.arn,
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
});

const policyAttachments = ['arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser'].map(
  (arn) => {
    const name = `GitHub_${arn.split('/')[1]}`;
    return new aws.iam.PolicyAttachment(name, {
      roles: [role],
      policyArn: arn,
    });
  },
);
