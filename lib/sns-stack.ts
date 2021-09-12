import * as cdk from "@aws-cdk/core";
import { Subscription, SubscriptionProtocol, Topic } from "@aws-cdk/aws-sns";

export class SnsStack extends cdk.Stack {
    public readonly topics: { [key: string]: Topic } = {};
    public readonly subscriptions: { [key: string]: Subscription } = {};

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Add SNS topic.
        this.addTopic("AccountNotifications");

        // Add SNS subscription.
        this.addSubscription(
            "AccountNotifications",
            this.topics.ACCOUNTNOTIFICATIONS,
            SubscriptionProtocol.EMAIL,
            "testemail@testemails.com"
        );
    }

    addTopic(name: string) {
        const topic = new Topic(this, name + "Topic", {});

        // Add role to class attribute, with uppercase key.
        this.topics[name.toUpperCase()] = topic;
    }

    addSubscription(
        name: string,
        topic: Topic,
        protocol: SubscriptionProtocol,
        endpoint: string
    ) {
        const subscription = new Subscription(this, name + "Subscription", {
            topic,
            protocol,
            endpoint,
        });

        // Add instance profile to class attribute, with uppercase key.
        this.subscriptions[name.toUpperCase()] = subscription;
    }
}
