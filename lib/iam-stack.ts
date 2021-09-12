import {
    CfnInstanceProfile,
    ManagedPolicy,
    Role,
    ServicePrincipal,
} from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";

export class IamStack extends cdk.Stack {
    roles: { [key: string]: Role } = {};
    instanceProfiles: { [key: string]: CfnInstanceProfile } = {};

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Add role.
        this.addRole("WebServer", new ServicePrincipal("ec2.amazonaws.com"));

        // Add instance profile.
        this.addInstanceProfile("WebServer", [this.roles.WEBSERVER]);
    }

    addRole(name: string, assumedBy: ServicePrincipal) {
        const role = new Role(this, name + "Role", {
            roleName: name,
            assumedBy: assumedBy,
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    "AmazonSSMManagedInstanceCore"
                ),
                ManagedPolicy.fromAwsManagedPolicyName(
                    "CloudWatchAgentServerPolicy"
                ),
            ],
        });

        // Add role to class attribute, with uppercase key.
        this.roles[name.toUpperCase()] = role;
    }

    addInstanceProfile(name: string, roles: Role[]) {
        const instanceProfile = new CfnInstanceProfile(
            this,
            name + "InstanceProfile",
            {
                instanceProfileName: name,
                roles: [],
            }
        );

        // Add instance profile to class attribute, with uppercase key.
        this.instanceProfiles[name.toUpperCase()] = instanceProfile;
    }
}
