# Contributing

This guide provides instructions for contributing to this Capacitor plugin.

## Plugin Flow

Plugins flow from the following files:

- `src/definitions.ts` - interface defintions for the plugin.   You would define something in this file first.

- `src/couchbase-lite/engine/capacitor.ts` - the main implementation of methods that are defined in the plugin.  Names MUST match the names from the native inmplementation in Swift/Java/Kotlin.  The Typescript code will usually call implementations that try to match the Couchbase Lite SDK.  Example the Database.ts file tries to separate out things like opening and closing a database to match the Couchbase Lite SDK.  
- `src/couchbase-lite/*.ts` - implementation files for various features of the plugin.  This is what developers using the plugin would import.
- `ios/Plugin/` this is the iOS native implementation of the plugin.  The file brakedown is:
    - `ios/IonicCouchbaseLitePlugin.h` - the interface for the main plugin.  The name must match the name of the plugin.
    - `ios/IonicCouchbaseLitePlugin.m` - the main implementation of the plugin. This defines the plugin using the CAP_PLUGIN Macro, and
    each method the plugin supports using the CAP_PLUGIN_METHOD macro. 
    - `ios/IonicCouchbaseLite.h` - the interface for the  implementation of the plugin bridge to Native code.
    - `ios/IonicCouchbaseLite.m` - the main implementation of the plugin bridge to Native code.  
- `android/src/` this is the Android native implementation of the plugin.  The file brakedown is:
    - `main/java/io/ionic/enterprise/couchbaselite/IonicCouchbaseLitePlugin.java` - the main implementation of the plugin and bridge.  The name must match the name of the plugin.
    - ``main/java/io/ionic/enterprise/couchbaselite/JsonQueryhBuilder.java`` - Helper class for building the Query Builder implementation.  
## Developing

### Local Setup

1. Fork and clone the repo.
1. Install the dependencies.

    ```shell
    npm install
    ```

1. Install SwiftLint if you're on macOS.

    ```shell
    brew install swiftlint
    ```

### Scripts

#### `npm run build`

Build the plugin web assets and generate plugin API documentation using [`@capacitor/docgen`](https://github.com/ionic-team/capacitor-docgen).

It will compile the TypeScript code from `src/` into ESM JavaScript in `dist/esm/`. These files are used in apps with bundlers when your plugin is imported.

Then, Rollup will bundle the code into a single file at `dist/plugin.js`. This file is used in apps without bundlers by including it as a script in `index.html`.

#### `npm run verify`

Build and validate the web and native projects.

This is useful to run in CI to verify that the plugin builds for all platforms.

#### `npm run lint` / `npm run fmt`

Check formatting and code quality, autoformat/autofix if possible.

This template is integrated with ESLint, Prettier, and SwiftLint. Using these tools is completely optional, but the [Capacitor Community](https://github.com/capacitor-community/) strives to have consistent code style and structure for easier cooperation.

## Publishing

There is a `prepublishOnly` hook in `package.json` which prepares the plugin before publishing, so all you need to do is run:

```shell
npm publish
```

> **Note**: The [`files`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) array in `package.json` specifies which files get published. If you rename files/directories or add files elsewhere, you may need to update it.
