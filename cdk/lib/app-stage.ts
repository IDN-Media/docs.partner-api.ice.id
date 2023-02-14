import {StackProps, Stage} from "aws-cdk-lib";
import {Construct} from "constructs";
import {EcsStack, EcsStackProps} from "./ecs-stack";

export interface AppStageProps extends StackProps, EcsStackProps {
  isDevEnvironment?: boolean;
}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    //
    // Start or entrypoint from here!
    // Call EcsStack
    new EcsStack(this, 'EcsStack', {...props});
  } 
}
