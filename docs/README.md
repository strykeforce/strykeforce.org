# Documentation

## Prerequisites

### AMI Import

1. Build AMI

```sh
nix build .#ami
```

2. Create Service Role

Required permissions for AMI import. [docs](https://docs.aws.amazon.com/vm-import/latest/userguide/required-permissions.html#vmimport-role)

```sh
aws --profile strykeforce iam create-role --role-name vmimport --assume-role-policy-document "file://$HOME/Code/strykeforce/strykeforce.org/docs/ami/trust-policy.json"

aws --profile strykeforce iam put-role-policy --role-name vmimport --policy-name vmimport --policy-document "file://$HOME/Code/strykeforce/strykeforce.org/docs/ami/role-policy.json"
```

3. Upload VHD Snapshot

4. Import Snapshot

```sh
aws --profile strykeforce ec2 import-snapshot --description "NixOS 24.11 (x86_64)" --disk-container "file://$HOME/Code/strykeforce/strykeforce.org/docs/ami/container.json"

aws --profile strykeforce ec2 describe-import-snapshot-tasks --import-task-ids <import-task-id>
```

5. Create AMI from Snapshot

[docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami-ebs.html#creating-launching-ami-from-snapshot)


## Development

## Deployment
