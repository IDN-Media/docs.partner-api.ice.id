import { CfnOutput } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { cfnExportNameSpace, paramStoreNameSpace } from '../bin/cdk';

export function addCfnExport(scope: Construct, name: string, value: string) {
  new CfnOutput(scope, name, { exportName: name, value });
}

export function addParamsStore(scope: Construct, name: string, value: string) {
  new StringParameter(scope, name, { parameterName: name, stringValue: value });
}

export function add(scope: Construct, name: string, value: string) {
  const exportName = `${cfnExportNameSpace}${name}`;
  const parameterName = `${paramStoreNameSpace}/${name}`;

  addCfnExport(scope, exportName, value);
  addParamsStore(scope, parameterName, value);
}
