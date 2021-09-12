import * as cdk from "@aws-cdk/core";
import {
    CfnInstanceProfile,
    ManagedPolicy,
    Role,
    ServicePrincipal,
} from "@aws-cdk/aws-iam";

export class IamStack extends cdk.Stack {
    public readonly roles: { [key: string]: Role } = {};
    public readonly instanceProfiles: { [key: string]: CfnInstanceProfile } = {};

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Add role.
        this.addRole("WebServer", new ServicePrincipal("ec2.amazonaws.com"));

        // Add instance profile.
        this.addInstanceProfile("WebServer", [this.roles.WEBSERVER]);
    }

    /**
     * Adds an IAM role.
     * 
     * @param name Name of the IAM role.
     * @param assumedBy AWS service principal to which the role is granted permission.
     */
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

    /**
     * Adds an IAM instance profile.
     * 
     * @param name Name of the instance profile.
     * @param roles Roles to add to the instance profile.
     */
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
