# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SesDomainIdentity <a name="SesDomainIdentity" id="cognito-ses-domain.SesDomainIdentity"></a>

A CDK construct to create an SES domain identity.

It can optionally create a Cognito Identity Pool and grant send permissions
to a Cognito User Pool.

#### Initializers <a name="Initializers" id="cognito-ses-domain.SesDomainIdentity.Initializer"></a>

```typescript
import { SesDomainIdentity } from 'cognito-ses-domain'

new SesDomainIdentity(scope: Construct, id: string, props: SesDomainIdentityProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.Initializer.parameter.props">props</a></code> | <code><a href="#cognito-ses-domain.SesDomainIdentityProps">SesDomainIdentityProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cognito-ses-domain.SesDomainIdentity.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cognito-ses-domain.SesDomainIdentity.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cognito-ses-domain.SesDomainIdentity.Initializer.parameter.props"></a>

- *Type:* <a href="#cognito-ses-domain.SesDomainIdentityProps">SesDomainIdentityProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cognito-ses-domain.SesDomainIdentity.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cognito-ses-domain.SesDomainIdentity.isConstruct"></a>

```typescript
import { SesDomainIdentity } from 'cognito-ses-domain'

SesDomainIdentity.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cognito-ses-domain.SesDomainIdentity.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.property.identityArn">identityArn</a></code> | <code>string</code> | The ARN of the created SES domain identity. |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.property.identityPoolId">identityPoolId</a></code> | <code>string</code> | The ID of the Cognito Identity Pool. |
| <code><a href="#cognito-ses-domain.SesDomainIdentity.property.sesCloudWatch">sesCloudWatch</a></code> | <code>ses-cloudwatch.SesCloudWatch</code> | The SesCloudWatch helper construct instance if logging was enabled via `sendingLogs`. |

---

##### `node`<sup>Required</sup> <a name="node" id="cognito-ses-domain.SesDomainIdentity.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `identityArn`<sup>Required</sup> <a name="identityArn" id="cognito-ses-domain.SesDomainIdentity.property.identityArn"></a>

```typescript
public readonly identityArn: string;
```

- *Type:* string

The ARN of the created SES domain identity.

---

##### `identityPoolId`<sup>Optional</sup> <a name="identityPoolId" id="cognito-ses-domain.SesDomainIdentity.property.identityPoolId"></a>

```typescript
public readonly identityPoolId: string;
```

- *Type:* string

The ID of the Cognito Identity Pool.

This will only be populated if `createIdentityPool` is true.

---

##### `sesCloudWatch`<sup>Optional</sup> <a name="sesCloudWatch" id="cognito-ses-domain.SesDomainIdentity.property.sesCloudWatch"></a>

```typescript
public readonly sesCloudWatch: SesCloudWatch;
```

- *Type:* ses-cloudwatch.SesCloudWatch

The SesCloudWatch helper construct instance if logging was enabled via `sendingLogs`.

---


## Structs <a name="Structs" id="Structs"></a>

### SesDomainIdentityProps <a name="SesDomainIdentityProps" id="cognito-ses-domain.SesDomainIdentityProps"></a>

Properties for the SesDomainIdentity construct.

#### Initializer <a name="Initializer" id="cognito-ses-domain.SesDomainIdentityProps.Initializer"></a>

```typescript
import { SesDomainIdentityProps } from 'cognito-ses-domain'

const sesDomainIdentityProps: SesDomainIdentityProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cognito-ses-domain.SesDomainIdentityProps.property.domain">domain</a></code> | <code>string</code> | The domain to use for the SES identity. |
| <code><a href="#cognito-ses-domain.SesDomainIdentityProps.property.userPool">userPool</a></code> | <code>aws-cdk-lib.aws_cognito.IUserPool</code> | The Cognito User Pool that will be granted permission to send emails. |
| <code><a href="#cognito-ses-domain.SesDomainIdentityProps.property.userPoolClientId">userPoolClientId</a></code> | <code>string</code> | The client ID of the user pool client. |
| <code><a href="#cognito-ses-domain.SesDomainIdentityProps.property.createIdentityPool">createIdentityPool</a></code> | <code>boolean</code> | Determines whether to create a Cognito Identity Pool and the associated IAM Role to grant users permission to send emails. |
| <code><a href="#cognito-ses-domain.SesDomainIdentityProps.property.sendingLogs">sendingLogs</a></code> | <code>ses-cloudwatch.SesCloudWatchProps</code> | Optional configuration to enable SES sending event logging powered by the `ses-cloudwatch` construct. |

---

##### `domain`<sup>Required</sup> <a name="domain" id="cognito-ses-domain.SesDomainIdentityProps.property.domain"></a>

```typescript
public readonly domain: string;
```

- *Type:* string

The domain to use for the SES identity.

This domain must exist as a public hosted zone in Route 53.

---

##### `userPool`<sup>Required</sup> <a name="userPool" id="cognito-ses-domain.SesDomainIdentityProps.property.userPool"></a>

```typescript
public readonly userPool: IUserPool;
```

- *Type:* aws-cdk-lib.aws_cognito.IUserPool

The Cognito User Pool that will be granted permission to send emails.

---

##### `userPoolClientId`<sup>Required</sup> <a name="userPoolClientId" id="cognito-ses-domain.SesDomainIdentityProps.property.userPoolClientId"></a>

```typescript
public readonly userPoolClientId: string;
```

- *Type:* string

The client ID of the user pool client.

This is needed to associate the user pool with the identity pool.

---

##### `createIdentityPool`<sup>Optional</sup> <a name="createIdentityPool" id="cognito-ses-domain.SesDomainIdentityProps.property.createIdentityPool"></a>

```typescript
public readonly createIdentityPool: boolean;
```

- *Type:* boolean
- *Default:* false

Determines whether to create a Cognito Identity Pool and the associated IAM Role to grant users permission to send emails.

Set this to `true` if your application users need to send emails via SES.

Set this to `false` if you only need to create the verified SES domain identity,
for example, to configure the User Pool's own email settings (e.g., for password resets).

---

##### `sendingLogs`<sup>Optional</sup> <a name="sendingLogs" id="cognito-ses-domain.SesDomainIdentityProps.property.sendingLogs"></a>

```typescript
public readonly sendingLogs: SesCloudWatchProps;
```

- *Type:* ses-cloudwatch.SesCloudWatchProps

Optional configuration to enable SES sending event logging powered by the `ses-cloudwatch` construct.

If provided, a configuration set, EventBridge rule, destination and LogGroup are created.
Omit (leave undefined) to disable sending event logs.

---



