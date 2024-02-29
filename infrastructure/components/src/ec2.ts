import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export class Ec2InstanceSsh extends pulumi.ComponentResource {
  private securityGroup: aws.ec2.SecurityGroup;
  public instance: aws.ec2.Instance;

  constructor(
    name: string,
    args: {
      vpc: aws.ec2.Vpc;
      subnetId: pulumi.Output<string>;
      keyPair: aws.ec2.KeyPair;
      userData?: string;
    },
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('infra:components:Ec2InstanceSsh', name, args, opts);

    const { vpc, subnetId, keyPair, userData } = args;

    this.securityGroup = new aws.ec2.SecurityGroup(`${name}-sg`, {
      vpcId: vpc.id,
      description: 'Allow inbound SSH',
      ingress: [{ protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] }],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
    });

    this.instance = new aws.ec2.Instance(`${name}-instance`, {
      ami: 'ami-0440d3b780d96b29d', // Amazon Linux 2023 AMI 2023.3.20240219.0 x86_64 HVM kernel-6.1
      instanceType: 't2.micro',
      keyName: keyPair.keyName,
      subnetId,
      ipv6AddressCount: 1,
      vpcSecurityGroupIds: [this.securityGroup.id],
      userData: userData ?? '',
    });

    this.registerOutputs({
      instance: this.instance,
      securityGroup: this.securityGroup,
    });
  }
}
