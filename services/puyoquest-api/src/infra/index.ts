/* eslint-disable @typescript-eslint/no-unused-vars */
import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

const config = new pulumi.Config();
const AWS_ACCOUNT_ID = config.get('AWS_ACCOUNT_ID');

if (!AWS_ACCOUNT_ID) {
  throw new Error('AWS_ACCOUNT_ID not found in Pulumi config!');
}

// // An ECS cluster to deploy into
// const cluster = new aws.ecs.Cluster('ppq-api-cluster', {
//   name: 'ppq-api-cluster', // this exact name gets referenced in a github actions yml
// });

// // An ALB to serve the container endpoint to the internet
// const loadBalancer = new awsx.lb.ApplicationLoadBalancer('ppq-api-lb', {
//   defaultTargetGroup: {
//     port: 3000,
//   },
// });

// // An ECR repository to store our application's container image
// const repo = new awsx.ecr.Repository('ppq-api-ecr', {
//   name: 'puyoquest-api',
//   forceDelete: true,
// });

// // Deploy an ECS Service on Fargate to host the application container.
// // I think this will fail on first run because the image won't exist yet.
// // I plan to manage the image pushes outside of Pulumi.
// const service = new awsx.ecs.FargateService('ppq-api-fg', {
//   name: 'ppq-api-service', // this exact name gets referenced in a github actions yml
//   cluster: cluster.arn,
//   assignPublicIp: true,
//   taskDefinitionArgs: {
//     family: 'ppq-api-task-family', // this exact name gets referenced in a github actions yml
//     container: {
//       name: 'puyoquest-api',
//       image: pulumi.interpolate`${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/puyoquest-api:latest`,
//       cpu: 256,
//       memory: 512,
//       essential: true,
//       portMappings: [
//         {
//           containerPort: 3000,
//           targetGroup: loadBalancer.defaultTargetGroup,
//         },
//       ],
//     },
//   },
// });

// export const url = pulumi.interpolate`http://${loadBalancer.loadBalancer.dnsName}`;
// export const taskFamily = await new Promise((res) =>
//   service.taskDefinition.apply((t) => res(t?.family)),
// );
