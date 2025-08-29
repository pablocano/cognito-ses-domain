import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Pablo Cano',
  authorAddress: 'pablo.cano@merapar.com',
  cdkVersion: '2.200.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cognito-ses-domain',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/pablocano/cognito-ses-domain.git',
  deps: [
    'ses-cloudwatch@^1.2.0',
  ],
  peerDeps: [
    'ses-cloudwatch@^1.2.0',
  ],
  devDeps: [
    'ses-cloudwatch@^1.2.0',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
// Exclude examples from published package
project.npmignore?.addPatterns('examples/');
project.synth();