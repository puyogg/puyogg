import * as awsx from '@pulumi/awsx';
import { VpcIpv6 } from '@puyogg/infra-components';

export const defaultVpc = new awsx.ec2.DefaultVpc('default-vpc');

export const puyoggVpc = new VpcIpv6('puyogg', { test: 'asdf' });
