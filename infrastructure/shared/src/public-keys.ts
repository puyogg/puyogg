import * as aws from '@pulumi/aws';

export const s2Key1 = new aws.ec2.KeyPair('s2Key1', {
  publicKey:
    'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGgF/s6yfKSi8AMMV1VcAEvlZ6iL9v1qgzJqBShExKHw s2lsoftener@gmail.com',
});
