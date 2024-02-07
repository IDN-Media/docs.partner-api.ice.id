import * as cdk from "aws-cdk-lib";
import { Duration, StackProps } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import {
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { join } from "path";
import { add } from "./utils";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { aws_ecs as ecs } from "aws-cdk-lib";
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";
export interface EcsStackProps extends StackProps {}

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: EcsStackProps) {
    super(scope, id, props);

    const zoneName: string = StringParameter.valueFromLookup(
      this,
      `/idn/ice/zoneName`
    );
    const vpcName: string = StringParameter.valueFromLookup(
      this,
      `/idn/ice/core/VpcName`
    );

    const containerName = "docs-partner-api";
    const containerPort = 3000;
    const nextPublicDomainName: string = `docs-partner-api.${zoneName}`;
    const nextPublicDomainZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: zoneName,
    });

    const vpc = Vpc.fromLookup(this, "Vpc", {
      vpcName: vpcName,
    });

    // Define docker image for ECS
    const dockerImage = new DockerImageAsset(this, "Image", {
      directory: join(__dirname, "..", ".."),
      //buildArgs: environment,
    });


    const ecsClusterName = StringParameter.fromStringParameterName(
      this,
      "EcsClusterName",
      "/idn/ice/core/EcsClusterName"
    ).stringValue;

    const ecsCluster = ecs.Cluster.fromClusterAttributes(this, "EcsCluster", {
      vpc,
      clusterName: ecsClusterName,
      securityGroups: [],
    });

    const albArn = StringParameter.valueFromLookup(
      this,
      "/idn/ice/core/AlbArn"
    );

    const albListenerArn = StringParameter.valueFromLookup(
      this,
      "/idn/ice/core/AlbListenerArn"
    );

    const alb = elbv2.ApplicationLoadBalancer.fromLookup(
      this,
      "ALBDocsPartner",
      {
        loadBalancerArn: albArn,
      }
    );

    const albInternalListener = elbv2.ApplicationListener.fromLookup(
      this,
      "ALBDocsPartnerListener",
      {
        listenerArn: albListenerArn,
      }
    );

    const taskDefinition = new FargateTaskDefinition(
      this,
      "DocsPartnerTaskDefinition",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    const container = taskDefinition.addContainer("DocsPartnerContainer", {
      containerName,
      image: ContainerImage.fromDockerImageAsset(dockerImage),
      cpu: 256,
      memoryLimitMiB: 512,
    });

    container.addPortMappings({
      containerPort: containerPort,
    });

    const service = new FargateService(this, "DocsPartnerEcs", {
      cluster: ecsCluster,
      taskDefinition,
      circuitBreaker: { rollback: true },
      desiredCount: 1,
      enableExecuteCommand: true,
    });

    const targetGroup = new elbv2.ApplicationTargetGroup(this, "TargetGroup", {
      targets: [service],
      port: 80,
      healthCheck: {
        path: "/health",
        interval: Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        timeout: Duration.seconds(4),
      },
      vpc: vpc,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    albInternalListener.addTargetGroups("ListenerTargetGroups", {
      targetGroups: [targetGroup],
      conditions: [elbv2.ListenerCondition.hostHeaders([nextPublicDomainName])],
      priority: 3,
    });

    new ARecord(this, "ALBDocsPartnerRecord", {
      recordName: containerName,
      zone: nextPublicDomainZone,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(alb)),
      deleteExisting: true,
    });

    add(this, "nextPublicDomainName", nextPublicDomainName);
  }
}
