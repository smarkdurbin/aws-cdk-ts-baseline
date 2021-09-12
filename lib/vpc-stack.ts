import * as cdk from "@aws-cdk/core";
import {
    IPeer,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "@aws-cdk/aws-ec2";

export class VpcStack extends cdk.Stack {
    public readonly vpc: Vpc;
    public readonly securityGroups: { [key: string]: SecurityGroup };

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Define CIDR for VPC.
        const cidr = "172.16.0.0/16";

        // Create VPC.
        this.vpc = new Vpc(this, "Vpc", {
            maxAzs: 2,
            cidr: cidr,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Reserved",
                    reserved: true,
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "Reserved",
                    reserved: true,
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "Private",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "Public",
                    subnetType: SubnetType.PUBLIC,
                },
            ],
        });

        // Define security groups.
        this.securityGroups = {
            WEBSERVER: this.createSecurityGroup("WebServer", [
                {
                    peer: Peer.anyIpv4(),
                    port: Port.tcp(80),
                    description: "HTTP",
                },
                {
                    peer: Peer.anyIpv4(),
                    port: Port.tcp(443),
                    description: "HTTPS",
                },
            ]),
            MYSQL: this.createSecurityGroup("MySqlServer", [
                {
                    peer: Peer.ipv4(cidr),
                    port: Port.tcp(3306),
                    description: "MySQL",
                },
            ]),
        };
    }

    createSecurityGroup(
        name: string,
        ingressRules: { peer: IPeer; port: Port; description: string }[],
        description?: string
    ) {
        const securityGroup = new SecurityGroup(this, name + "SecurityGroup", {
            vpc: this.vpc,
            securityGroupName: name,
            description: description,
        });

        for (const rule of ingressRules) {
            securityGroup.addIngressRule(
                rule.peer,
                rule.port,
                rule.description
            );
        }

        return securityGroup;
    }
}
