import * as cdk from "@aws-cdk/core";
import { Peer, Port, SecurityGroup, SubnetType, Vpc } from "@aws-cdk/aws-ec2";

export class VpcStack extends cdk.Stack {
    public readonly vpc: Vpc;
    public readonly security_groups: { [key: string]: SecurityGroup };

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

        // Create web server secruity group.
        new SecurityGroup(this, "WebserverSecurityGroup", {
            vpc: this.vpc,
        });

        // Create security group.
        const web_server_sg = new SecurityGroup(
            this,
            "WebServerSecurityGroup",
            {
                vpc: this.vpc,
                securityGroupName: "WebServer",
            }
        );

        // Add ingress rule to security group.
        web_server_sg.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(80),
            "HTTP"
        );

        // Add ingress rule to security group.
        web_server_sg.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(443),
            "HTTPS"
        );

        // Define security groups.
        this.security_groups = {
            WEBSERVER: web_server_sg,
        };
    }
}
