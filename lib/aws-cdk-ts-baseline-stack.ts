import * as cdk from "@aws-cdk/core";
import { VpcStack } from "./vpc-stack";

export class AwsCdkTsBaselineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC stack.
        new VpcStack(this, "VpcStack", {
            env: props?.env,
        });
    }
}
