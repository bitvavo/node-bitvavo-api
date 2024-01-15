Contributing
============

The release process for Bitvavo SDK for Node.js is semi-automatic. You manually start the GitHub Action that creates
the SDK package and uploads it to [npmjs](https://www.npmjs.com/package/bitvavo).

## Prerequisites

To release the SDK you need to:

- Complete the instructions in the [README Prerequisites](./README.md#prerequisites)
- Clone https://github.com/bitvavo/node-bitvavo-api to your development device

## Release a new version of the SDK

To update the SDK and publish your changes to the Bitvavo developer community:

1. **Make your updates to the SDK**

   Create a branch and implement your changes to the SDK.

2. **Test the package**
   1. Run the smoke tests in `<repo-root>/example/testApi.js`
   1. When your code passes the smoke tests, make a pull request
      to the `master` branch.

1. **Publish the SDK**

   1. When your [pull request](https://github.com/bitvavo/node-bitvavo-api/pulls) is approved, merge your changes to
      the `master` branch.
   1. Note the release number of the
      [latest version of the SDK published to npmjs](https://www.npmjs.com/package/bitvavo?activeTab=versions)
      and using [semver](https://semver.org/) as your guide, decide on a version number for this release.
   1. In Actions, [run the release action](https://github.com/bitvavo/node-bitvavo-api/actions/workflows/release.yml)
      using your new release number.

   1. Open the draft release created when you ran the release action.
   1. Add a brief description about the release.

      This description is visible to the world in https://github.com/bitvavo/node-bitvavo-api/releases.
   1. Click **Publish**.

      This starts the Publish action. You see the
      [new version available on npmjs](https://www.npmjs.com/package/bitvavo).

Now send the release message in Slack, yay.


