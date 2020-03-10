---
title: 'Health Check'
date: 2020-03-10T17:24:41-04:00
description: Health check HOWTO
author: Jeff Hutchison
draft: false
---

# Third Coast Health Check

Third Coast Health Check is an automated motor speed and current check for Java robots that we run in our Pit during competion. Detecting changes in speed or current for a given drive voltage can help predict failures.

{{< figure src="example.png" title="Example of Health Check Report" >}}

## Design

We use Kotlin to implement the health check framework so we can write health checks in a domain-specific languange (DSL). An example of a health check written in this DSL:

```kotlin
healthCheck = healthCheck {
    talonCheck {
        name = "swerve azimuth tests"
        talons = Robot.DRIVE.allWheels.map { it.azimuthTalon }

        timedTest {
            percentOutput = 0.25
            currentRange = 0.25..0.75
            speedRange = 215..250
        }
    }
}
```

This says run all azimuth talons a 25% output for a preset amount of time and measure average current and speed. The test passes if average current is in `currentRange` and average speed is in `speedRange`.

See the `HealthCheckCommand` in [https://github.com/strykeforce/deepspace/](https://github.com/strykeforce/deepspace/blob/master/src/main/kotlin/frc/team2767/deepspace/command/HealthCheckCommand.kt) for a full example. **Note this is robot season and motor controller specific, you will need to customize the command for your own robot.**

Results of the health check are written to `/var/local/natinst/www/healthcheck/index.html` and use the roboRIO embedded web server to display results at **http://10.TE.AM.2/healthcheck/index.html**

## Instructions

1. A functional 2019 example of Kotlin code to drive the health checks is located in our [DEEPSPACE code repository](https://github.com/strykeforce/deepspace/tree/master/src/main/kotlin/frc/team2767/deepspace/health). Add this code to your project.
2. A CSS stylesheet for the report is is located in `src/main/resources/healthcheck.css` and should also be copied to your project.
3. Create the report output directory and make this directory writable by the robot program:

```sh
$ mkdir /var/local/natinst/www/healthcheck
$ chown lvuser /var/local/natinst/www/healthcheck
```

4. Create a command, similar to `HealthCheckCommand` above, to define specific tests to run.
5. Attach this command to a Smart Dashboard button that will start it.
