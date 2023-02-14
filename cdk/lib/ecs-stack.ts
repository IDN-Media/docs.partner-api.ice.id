import * as cdk from 'aws-cdk-lib';
import {Duration, StackProps} from 'aws-cdk-lib';
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager';
import {Vpc} from 'aws-cdk-lib/aws-ec2';
import {DockerImageAsset} from 'aws-cdk-lib/aws-ecr-assets';
import {ContainerImage} from 'aws-cdk-lib/aws-ecs';
import {ApplicationLoadBalancedFargateService} from 'aws-cdk-lib/aws-ecs-patterns';
import {ApplicationProtocol} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import {HostedZone} from 'aws-cdk-lib/aws-route53';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import {join} from 'path';
import {add} from './utils';

export interface EcsStackProps extends StackProps {
}

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

    const nextPublicDomainName: string = `docs-partner-api.${zoneName}`;
    const nextPublicDomainZone = HostedZone.fromLookup(
      this,
      'HostedZone',
      {
        domainName: zoneName
      }
    );
    
    const certificateArn = StringParameter.fromStringParameterName(
      this,
      'CertificateArn',
      `/idn/ice/acmArn`
    ).stringValue;

    const certificate = Certificate.fromCertificateArn(
      this,
      'Certificate',
      certificateArn
    );

    const vpc = Vpc.fromLookup(
      this,
      'Vpc',
      {
        vpcName: vpcName
      }
    );

    // Define docker image for ECS
    const dockerImage = new DockerImageAsset(
      this,
      'Image',
      {
        directory: join(__dirname, '..', '..'),
        //buildArgs: environment,
      }
    );

    // Define ECS cluster
    const ecsCluster = new ApplicationLoadBalancedFargateService(
      this,
      'ECSCluster',
      {
        vpc,
        taskImageOptions: {
          image: ContainerImage.fromDockerImageAsset(dockerImage),
          containerPort: 3000,
          //environment: environment,
        },
        enableExecuteCommand: true,
        domainName: nextPublicDomainName,
        domainZone: nextPublicDomainZone,
        certificate: certificate,
        protocol: ApplicationProtocol.HTTPS,
        redirectHTTP: true,
      }
    );

    // Define health check
    ecsCluster.targetGroup.configureHealthCheck({
      path: '/health',
      interval: Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: Duration.seconds(4),
    });

    add(this, 'nextPublicDomainName', nextPublicDomainName);
  }
}
