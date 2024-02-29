import * as aws from '@pulumi/aws';
// import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

function calcualteIpv6Cidr(cidrBlock: string, idx: number): string {
  const firstFourSlices = cidrBlock.split(':').slice(0, 4);
  const base10Slices = firstFourSlices.map((hex) => parseInt(hex, 16));
  base10Slices[base10Slices.length - 1] = base10Slices[base10Slices.length - 1] + idx;

  const backToHex = base10Slices.map((dec) => dec.toString(16).padStart(4));
  return `${backToHex.join(':')}::/64`;
}

export class VpcIpv6 extends pulumi.ComponentResource {
  public vpc: aws.ec2.Vpc;
  public publicSubnet: aws.ec2.Subnet;
  public privateSubnetA: aws.ec2.Subnet;
  public privateSubnetB: aws.ec2.Subnet;
  private internetGateway: aws.ec2.InternetGateway;
  private publicRouteTable: aws.ec2.RouteTable;
  private publicRouteTableAssociation: aws.ec2.RouteTableAssociation;

  constructor(name: string, args: Record<string, unknown>, opts?: pulumi.ComponentResourceOptions) {
    super('infra:components:VpcIpv6', name, args, opts);

    this.vpc = new aws.ec2.Vpc(`${name}-vpc`, {
      assignGeneratedIpv6CidrBlock: true,
      cidrBlock: '10.0.0.0/16',
      enableDnsSupport: true,
      enableDnsHostnames: true,
    });

    this.internetGateway = new aws.ec2.InternetGateway(`${name}-ig`, { vpcId: this.vpc.id });

    this.publicRouteTable = new aws.ec2.RouteTable(`${name}-rt`, {
      vpcId: this.vpc.id,
      routes: [
        {
          cidrBlock: '0.0.0.0/0',
          gatewayId: this.internetGateway.id,
        },
      ],
    });

    this.publicSubnet = new aws.ec2.Subnet(`${name}-public-subnet`, {
      vpcId: this.vpc.id,
      cidrBlock: '10.0.1.0/24',
      mapPublicIpOnLaunch: true,
      assignIpv6AddressOnCreation: true,
      ipv6CidrBlock: this.vpc.ipv6CidrBlock.apply((cidr) => calcualteIpv6Cidr(cidr, 0)),
    });

    this.publicRouteTableAssociation = new aws.ec2.RouteTableAssociation(`${name}-rt-assoc`, {
      routeTableId: this.publicRouteTable.id,
      subnetId: this.publicSubnet.id,
    });

    this.privateSubnetA = new aws.ec2.Subnet(`${name}-private-subnet-a`, {
      vpcId: this.vpc.id,
      cidrBlock: '10.0.2.0/24',
      mapPublicIpOnLaunch: true,
      assignIpv6AddressOnCreation: true,
      ipv6CidrBlock: this.vpc.ipv6CidrBlock.apply((cidr) => calcualteIpv6Cidr(cidr, 1)),
      availabilityZone: 'us-east-1a',
    });

    this.privateSubnetB = new aws.ec2.Subnet(`${name}-private-subnet-b`, {
      vpcId: this.vpc.id,
      cidrBlock: '10.0.3.0/24',
      mapPublicIpOnLaunch: true,
      assignIpv6AddressOnCreation: true,
      ipv6CidrBlock: this.vpc.ipv6CidrBlock.apply((cidr) => calcualteIpv6Cidr(cidr, 2)),
      availabilityZone: 'us-east-1b',
    });

    this.registerOutputs({
      vpc: this.vpc,
      publicSubnet: this.publicSubnet,
      privateSubnetA: this.privateSubnetA,
      privateSubnetB: this.privateSubnetB,
    });
  }
}
