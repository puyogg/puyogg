import * as awsx from '@pulumi/awsx';

export const defaultVpc = new awsx.ec2.DefaultVpc('default-vpc');
