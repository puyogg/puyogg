import * as awsx from '@pulumi/awsx';

export const defaultVpc = new awsx.ec2.DefaultVpc('default-vpc');

export const puyoggVpc = new awsx.ec2.Vpc('puyogg-vpc', {
  assignGeneratedIpv6CidrBlock: true,
  cidrBlock: '10.0.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true,
  natGateways: { strategy: awsx.ec2.NatGatewayStrategy.None },
});
