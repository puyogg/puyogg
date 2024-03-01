/* eslint-disable @typescript-eslint/no-unused-vars */
import * as pulumi from '@pulumi/pulumi';
import { Ec2InstanceSsh } from '@puyogg/infra-components';
import { publicKeys, puyoggVpc } from '@puyogg/infra-shared';

// const dbMaintenanceInstance = new Ec2InstanceSsh('puyogg-db-maintenance', {
//   vpc: puyoggVpc.vpc,
//   subnetId: puyoggVpc.publicSubnet.id,
//   keyPair: publicKeys.s2Key1,
//   userData: `#!/bin/bash
//   sudo su -
//   sudo dnf update
//   sudo dnf install postgresql15 -y
//   `,
// });
// export const dbMaintenancePublicIp = dbMaintenanceInstance.instance.publicIp;
// export const dbMaintenanceSshConnect = pulumi.interpolate`ssh -i ~/.ssh/id_ed25519 ec2-user@${dbMaintenanceInstance.instance.publicDns}`;
