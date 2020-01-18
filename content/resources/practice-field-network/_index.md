---
date: 2017-10-20T12:54:08Z
draft: false
title: Robot Practice Field Network
description: A reference on setting up practice field driver station to robot networking on our home practice field.
draft: false
---

While using FRC radios in the default configuration is easy to set up, having to connect to an isolated robot access point is inconvienient during development when Internet access is useful. We have installed [OpenWRT](https://openwrt.org) on the Open Mesh OM5P-AN used on our robots to allow us to connect to our robot via shop WiFi. This also helps with WiFi packet loss we experienced with our Driver Station laptops since we can now connect them to our shop network via Ethernet.

## Diagram

![network diagram](network_diagram.png)

## Open Mesh OM5P-AN Radio

The radio is configured using OpenWRT as a router with its WiFi interface connecting to our shop network with static IP address `192.168.3.251` and its ethernet ports on the `10.27.67.0/24` network. The OpenWRT configuration backup is on the team's Google drive.

The interfaces have the following configuration:

```
config interface 'lan'
        option force_link '1'
        option type 'bridge'
        option proto 'static'
        option netmask '255.255.255.0'
        option ip6assign '60'
        option _orig_ifname 'eth0 radio0.network1 radio1.network1'
        option _orig_bridge 'true'
        option ipaddr '10.27.67.1'
        option gateway '192.168.3.1'
        option broadcast '10.27.67.255'
        option ifname 'eth0 eth1'

config interface 'wwan'
        option _orig_ifname 'wlan1'
        option _orig_bridge 'false'
        option proto 'static'
        option ipaddr '192.168.3.251'
        option netmask '255.255.255.0'
        option gateway '192.168.3.1'
        option broadcast '192.168.3.255'
        option dns '192.168.3.1'
```

The WiFi connection to our shop's network has this configuration:

```
config wifi-iface
	option ssid 'SYKFRC'
	option encryption 'psk2'
	option device 'radio1'
	option mode 'sta'
	option bssid '82:2A:A8:58:5F:6B'
	option key '<wifi password>'
	option network 'wwan'
```

The firewall has this configuration:

```
config zone
	option name 'lan'
	option input 'ACCEPT'
	option output 'ACCEPT'
	option forward 'ACCEPT'
	option network 'lan'

config zone
	option input 'ACCEPT'
	option forward 'ACCEPT'
	option output 'ACCEPT'
	option name 'sykfrc'
	option network 'wwan'
	option mtu_fix '1'
	option masq '0'

config forwarding
	option dest 'lan'
	option src 'sykfrc'
```

## Router

Our router is configured with a static route to the robot radio.

![static route](router_static_route.png)

## Resources

Some material referenced when setting this up.

- [OpenWRT](https://openwrt.org)
- [Andymark OMP5-AN setup guide](http://files.andymark.com/OM5P-AN_QuickAP_Setup.pdf)
- [Open Mesh Tech Data and Device Pages](https://openwrt.org/toh/hwdata/open-mesh/start?s[]=open-mesh)
- [Lock down of Open Mesh devices](https://github.com/true-systems/om5p-ac-v2-unlocker/wiki/Lock-down-of-Open-Mesh-devices)
