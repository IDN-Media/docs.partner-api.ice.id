#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStage, AppStageProps } from '../lib/app-stage';

export const paramStoreNameSpace = '/idn/ice/docsPartnerApi';
export const cfnExportNameSpace = 'IceDocsPartnerWebsite';
const trustedAccount: string = '727174507127';
const region: string = 'ap-southeast-1';

const commonProps = {
  trustedAccount
}

const app = new cdk.App({
  context: {
    ghRef: process.env.GITHUB_REF
  }
});

const ghRef = app.node.tryGetContext('ghRef');

const BETA: AppStageProps = {
  ...commonProps,
  env: {
    account: '590411560808',
    region: region
  },
}

if (ghRef === 'refs/heads/master') {
  // Deploy to beta/staging environment ...
  new AppStage(
    app,
    `Beta-${cfnExportNameSpace}`,
    { ...BETA},
  );
}
