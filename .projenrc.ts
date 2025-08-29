import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Pablo Cano',
  authorAddress: 'pablo.cano@merapar.com',
  cdkVersion: '2.200.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cognito-ses-domain',
  packageName: 'cognito-ses-domain',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/pablocano/cognito-ses-domain.git',
  license: 'MIT',
  copyrightOwner: 'Merapar Technologies Group B.V.',
  deps: [
    'ses-cloudwatch@^1.2.0',
  ],
  peerDeps: [
    'ses-cloudwatch@^1.2.0',
  ],
  devDeps: [
    'ses-cloudwatch@^1.2.0',
  ],
});
// Exclude examples from published package
project.npmignore?.addPatterns('examples/');
project.synth();