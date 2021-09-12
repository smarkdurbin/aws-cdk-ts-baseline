import * as cdk from "@aws-cdk/core";
import {
    IPeer,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "@aws-cdk/aws-ec2";
import { group } from "console";

export class VpcStack extends cdk.Stack {
    public readonly vpc: Vpc;
    public readonly securityGroups: { [key: string]: SecurityGroup };

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC.
        this.vpc = new Vpc(this, "Vpc", {
            maxAzs: 2,
            cidr: "172.16.0.0/16",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Reserved",
                    reserved: true, // Reserving first /24 of CIDR.
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "Reserved",
                    reserved: true, // Reserving second /24 of CIDR.
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

        // Add security group to VPC.
        this.addSecurityGroupToVpc("WebServer", [
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
        ]);

        // Add security group to VPC.
        this.addSecurityGroupToVpc("MySqlServer", [
            {
                peer: Peer.ipv4(this.vpc.vpcCidrBlock),
                port: Port.tcp(3306),
                description: "MySQL",
            },
        ]);
    }

    /**
     * Adds a security group for the VPC created in this class.
     *
     * @param name Name of the security group.
     * @param ingressRules Ingress rulesfor the security group.
     * @param description Description of the security group.
     * @returns void
     */
    addSecurityGroupToVpc(
        name: string,
        ingressRules: { peer: IPeer; port: Port; description: string }[] = [],
        egressRules: { peer: IPeer; port: Port; description: string }[] = [],
        description?: string
    ) {
        // Create security group.
        const securityGroup = new SecurityGroup(this, name + "SecurityGroup", {
            vpc: this.vpc,
            securityGroupName: name,
            description: description,
        });

        // Add ingress rules to security group.
        for (const rule of ingressRules) {
            securityGroup.addIngressRule(
                rule.peer,
                rule.port,
                rule.description
            );
        }

        // Add egress rules to security group.
        for (const rule of egressRules) {
            securityGroup.addEgressRule(
                rule.peer,
                rule.port,
                rule.description
            );
        }

        // Add security group to class attribute, with uppercase key.
        this.securityGroups[name.toUpperCase()] = securityGroup;
    }
}
