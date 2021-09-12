import * as cdk from "@aws-cdk/core";
import { SubnetGroup } from "@aws-cdk/aws-rds";
import { SubnetType } from "@aws-cdk/aws-ec2";
import { VpcStack } from "./vpc-stack";

export class RdsStack extends cdk.Stack {
    public readonly subnetGroups: { [key: string]: SubnetGroup } = {};
    private readonly vpcStack: VpcStack;

    constructor(
        scope: cdk.Construct,
        id: string,
        vpcStack: VpcStack,
        props?: cdk.StackProps
    ) {
        super(scope, id, props);

        // Define VPC stack.
        this.vpcStack = vpcStack;

        // Add subnet group.
        this.addSubnetGroup("Private", SubnetType.PRIVATE_ISOLATED);
    }

    /**
     * Adds a subnet group to VPC in VPC stack.
     * 
     * @param name Name of subnet group.
     * @param subnetType Type of subnets to add to group.
     * @param description Description of subnet group.
     */
    addSubnetGroup(name: string, subnetType: SubnetType, description?: string ) {
        const subnetGroup = new SubnetGroup(this, name + 'SubnetGroup', {
            description: "",
            vpc: this.vpcStack.vpc,
            vpcSubnets: {
                subnetType: subnetType
            }
        })
    }
}
