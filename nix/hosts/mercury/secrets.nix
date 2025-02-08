let
  jeff = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPqpWpNJzfzioGYyR9q4wLwPkBrnmc/Gdl6JsO+SUpel";

  # ssh-keyscan <host>
  mercury = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILhGipOiZuS0fFDoPla7sPJdUWCvU6V0gKlw4xncQw/D";

in
{
  "strykeforce_website_secrets.age".publicKeys = [
    jeff
    mercury
  ];
  "strykeforce_s3_secrets.age".publicKeys = [
    jeff
    mercury
  ];
}
