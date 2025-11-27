import * as aws from "@pulumi/aws";

// ----- 1. Networking using default VPC -----

// Use the default VPC in the chosen region
const defaultVpc = aws.ec2.getVpcOutput({
  default: true,
});

// Get subnets that belong to the default VPC
const defaultSubnets = aws.ec2.getSubnetsOutput({
  filters: [
    {
      name: "vpc-id",
      values: [defaultVpc.id],
    },
  ],
});

// Security group allowing SSH and app ports
const sg = new aws.ec2.SecurityGroup("family-planner-sg", {
  vpcId: defaultVpc.id,
  ingress: [
    // SSH
    {
      protocol: "tcp",
      fromPort: 22,
      toPort: 22,
      cidrBlocks: ["0.0.0.0/0"], // later you can restrict to your IP
    },
    // Frontend
    {
      protocol: "tcp",
      fromPort: 3000,
      toPort: 3000,
      cidrBlocks: ["0.0.0.0/0"],
    },
    // API
    {
      protocol: "tcp",
      fromPort: 3001,
      toPort: 3001,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
});

// ----- 2. AMI lookup (no top-level await, Pulumi-style) -----

// Use getAmiOutput so we can reference it without async/await
const ami = aws.ec2.getAmiOutput({
  owners: ["amazon"],
  mostRecent: true,
  filters: [
    {
      name: "name",
      values: ["al2023-ami-*-kernel-*"],
    },
  ],
});

// ----- 3. User data script -----

// This script runs when the instance boots.
// It installs Docker + git, clones your repo, and runs docker compose.
const userData = `#!/bin/bash
set -eux

# Update system
dnf update -y

# Install Docker and git
dnf install -y docker git

# Enable and start Docker
systemctl enable docker
systemctl start docker

# OPTIONAL: install docker-compose v2 as standalone binary
curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone the project
cd /home/ec2-user
if [ ! -d "family-planner" ]; then
  git clone https://github.com/olegade/family-planner.git
fi

cd family-planner

# Start the stack
docker-compose up -d --build
`;

// ----- 4. EC2 instance -----

const instance = new aws.ec2.Instance("family-planner-ec2", {
  ami: ami.id,
  instanceType: "t3.micro", // cheap general-purpose instance
  subnetId: defaultSubnets.ids[0],
  vpcSecurityGroupIds: [sg.id],
  associatePublicIpAddress: true,
  userData,
  tags: {
    Name: "family-planner-ec2",
  },
});

// ----- 5. Outputs -----

export const publicIp = instance.publicIp;
export const publicDns = instance.publicDns;
export const frontendUrl = instance.publicIp.apply(
  (ip) => `http://${ip}:3000`
);
export const apiUrl = instance.publicIp.apply(
  (ip) => `http://${ip}:3001`
);