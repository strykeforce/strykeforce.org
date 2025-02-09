let
  # ssh-keyscan <host>
  jeff = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPqpWpNJzfzioGYyR9q4wLwPkBrnmc/Gdl6JsO+SUpel";
  pallas = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBeB+n+G1c6c2VZvPlfllS/Hnw7u6S8mn7ILWMK29iwe";
  keys = [
    jeff
    pallas
  ];
in
{
  "aws_secret.age".publicKeys = keys;
  "sasl_passwd.age".publicKeys = keys;
  "strykeforce_website_secrets.age".publicKeys = keys;
}
