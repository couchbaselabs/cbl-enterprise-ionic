# Contributing

This guide provides instructions for contributing to this Capacitor plugin.

## Development Requirements
- Javascript
    - [Node 18](https://formulae.brew.sh/formula/node@18)
- Capacitor
    - [Capacitor v5 cli](https://capacitorjs.com/docs/getting-started)
    - [Understanding on Capacitor Plugins Development](https://capacitorjs.com/docs/plugins/creating-plugins)
- [Visual Studio Code](https://code.visualstudio.com/download)
    -[Visual Studio Code Ionic Extension](https://capacitorjs.com/docs/vscode/getting-started)
- iOS Development
    - A modern Mac 
     - [XCode 14](https://developer.apple.com/xcode/) or higher installed and working (XCode 15 installed is preferred)
    - [XCode Command Line Tools](https://developer.apple.com/download/more/) installed 
    - [Simulators](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators) downloaded and working
    - [Homebrew](https://brew.sh/) 
    - [Cocopods](https://formulae.brew.sh/formula/cocoapods)
   
    - A valid Apple Developer account and certificates installed and working
- Android Development
    - [Android Studio](https://developer.android.com/studio?gad_source=1&gclid=CjwKCAjwzN-vBhAkEiwAYiO7oALYfxbMYW_zkuYoacS9TX16aItdvLYe6GB7_j1QwvXBjFDRkawfUBoComcQAvD_BwE&gclsrc=aw.ds) installed and working
    - Android SDK 34 >= installed and working (with command line tools)
    - A Android Emulator downloaded and working 

## Plugin Project Structure

- `src/definitions.ts` - interface defintions for the plugin.  This defines the interface `IonicCouchbaseLitePlugin` that inherrits from the interface `ICoreEngine`.  `IonicCouchbaseLitePlugin` is used by Capacitor to connect to the Engine that implements the bridge between the Javascript code in cblite JS npm package and the native code in the iOS and Android projects.  This file is used to define the methods that the plugin supports.  The names of the methods in this file must match the names of the methods in the native implementation which are defined in both interface files.  

- `src/couchbase-lite/engine/capacitor-engine.ts` - the main implementation of methods that are defined in the plugin for Ionic.  Names MUST match the names from the native inmplementation in Swift/Java/Kotlin.  The Typescript code will usually call implementations that try to match the Couchbase Lite SDK.  Example the Database.ts file tries to separate out things like opening and closing a database to match the Couchbase Lite SDK.  

- `ios/Plugin/` this is the iOS native implementation of the plugin.  The file brakedown is:
    - `ios/IonicCouchbaseLitePlugin.h` - the interface for the main plugin.  The name must match the name of the plugin.
    - `ios/IonicCouchbaseLitePlugin.m` - the main implementation of the plugin. This defines the plugin using the CAP_PLUGIN Macro, and
    each method the plugin supports using the CAP_PLUGIN_METHOD macro. 
    - `ios/IonicCouchbaseLite.h` - the interface for the  implementation of the plugin bridge to Native code.
    - `ios/IonicCouchbaseLite.m` - the main implementation of the plugin bridge to Native code.  
- `android/src/` this is the Android native implementation of the plugin.  The file brakedown is:
    - `main/java/io/ionic/enterprise/couchbaselite/IonicCouchbaseLitePlugin.java` - the main implementation of the plugin and bridge.  The name must match the name of the plugin.
    - ``main/java/io/ionic/enterprise/couchbaselite/JsonQueryhBuilder.java`` - Helper class for building the Query Builder implementation.  
- `cblite-core` this is the Javascript implementation of the Couchbase Lite SDK which includes definitions for the main classes and methods in the Couchbase Lite SDK.  This is used by the plugin to call the native code.
- `cblite-core-tests` this is the Javascript end to end (e2e) test that are used to fully test the plugin to validate that all functionality works.  This includes a custom test runner that can be used by any UI to run the tests.

## Local Setup

### How to Build the Plugin

1. Fork and clone the repo.
2. Install the dependencies.

    ```shell
    npm install
    ```
3. Install SwiftLint if you're on macOS.

    ```shell
    brew install swiftlint
    ```
4. Install Cocopods if you are going to work on iOS. 

    ```shell
    cd ios
    pod install 
    ```
4. Run npm build to build Javascript - from project root.

    ```shell
    npm run buildAll
    npm run verify
    ```
### Scripts

#### `npm run buildAll`

Build cblite-core.js npm module, cblite-core-tests npm package, and the plugin web assets.

It will compile the TypeScript code from the `cblite-core`, `cblite-core-tests`, and `src/` into ESM JavaScript in `dist/esm/`. These files are used in apps with bundlers when your plugin is imported.

Then, Rollup will bundle the code `dist/plugin.js` with the other two npm packages included. This file is used in apps without bundlers by including it as a script in `index.html`.

#### `npm run verify`

Build and validate the web and native projects.

This is useful to run in CI to verify that the plugin builds for all platforms.

#### `npm run lint` / `npm run fmt`

Check formatting and code quality, autoformat/autofix if possible.

This template is integrated with ESLint, Prettier, and SwiftLint. Using these tools is completely optional, but the [Capacitor Community](https://github.com/capacitor-community/) strives to have consistent code style and structure for easier cooperation.

### Running the example app
From your terminal, change into the example app's directory and run npm build

```shell
cd example
npm install
npm run build
```

Now you can use ionic capacitor to run iOS or Android with hot reload support

**iOS**

First time running requires doing a pod install in the ios/App directory of the example folder.  After that you can run the app with the following command. 

```shell
cd ios
cd App
pod install
cd ../..
```

Once the pod files are installed from the root of the example app folder you can do:

```shell
ionic capacitor run ios -l --external
```

**Android**
```shell
ionic capacitor run android -l --external
```

Any new features should be published with e2e tests that are ran against the example app.

## TODO - Publishing

This section is not complete - **DO NOT FOLLOW**:

There is a `prepublishOnly` hook in `package.json` which prepares the plugin before publishing, so all you need to do is run:

```shell
npm publish
```

> **Note**: The [`files`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) array in `package.json` specifies which files get published. If you rename files/directories or add files elsewhere, you may need to update it.
