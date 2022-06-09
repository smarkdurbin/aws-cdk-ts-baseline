import * as cdk from "@aws-cdk/core";
import { IamStack } from "./iam-stack";
import { RdsStack } from "./rds-stack";
import { SnsStack } from "./sns-stack";
import { VpcStack } from "./vpc-stack";

export class AwsCdkTsBaselineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create IAM stack.
        const iamStack = new IamStack(this, "IamStack", {
            env: props?.env,
        });

        // Create SNS stack.
        const snsStack = new SnsStack(this, "SnsStack", {
            env: props?.env,
        });

        // Create VPC stack.
        const vpcStack = new VpcStack(this, "VpcStack", {
            env: props?.env,
        });

        // Create RDS stack.
        new RdsStack(this, "RdsStack", vpcStack, {
            env: props?.env,
        });
    }
}
