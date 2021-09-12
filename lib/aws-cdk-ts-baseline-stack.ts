import * as cdk from "@aws-cdk/core";
import { RdsStack } from "./rds-stack";
import { VpcStack } from "./vpc-stack";

export class AwsCdkTsBaselineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC stack.
        const vpcStack = new VpcStack(this, "VpcStack", {
            env: props?.env,
        });

        // Create RDS stack.
        new RdsStack(this, "RdsStack", vpcStack, {
            env: props?.env,
        })
    }
}
