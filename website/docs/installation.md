---
title: Installation
sidebar_label: Installation
---

To installing Ionic's Couchbase Lite integration into your app, first check the prerequisites to make sure your app is compatible, and then install the package into your app.

## Prerequisites

**Important:** Ionic's Couchbase Lite integration uses Couchbase Lite Enterprise, and requires an existing Couchbase subscription with access to enterprise mobile functionality.

Ionic's Couchbase Lite integration requires Capacitor 3.0 or above, and is _not_ compatible with Cordova-based Ionic apps. We _strongly_ recommend migrating to Capacitor and we offer [official migration support](https://ionic.io/advisory) to help your team navigate the transition.

## Installation

To get started, install the `@ionic-enterprise/couchbase-lite` package into your Ionic/Capacitor app:

```shell
npm install @ionic-enterprise/couchbase-lite
```

## Android: Add Maven Repo

Edit your `android/build.gradle` file and update the `allprojects` entry to make sure the Couchbase maven repository is listed:

```groovy
allprojects {
    repositories {
        google()
        jcenter()
        maven { url 'https://mobile.maven.couchbase.com/maven2/dev/' }
    }
}
```

## Sync Project

Then, sync your Capacitor app to load any native dependencies:

```shell
npx cap sync
# or
ionic capacitor sync
```

Once installed, move onto [Usage](./usage) to see how to start using Couchbase Lite in your app.
