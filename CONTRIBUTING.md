Contributing
============

## Prerequisites
To release the SDK from your local development device you need:
- Node installed on your development device
- Clone https://github.com/bitvavo/node-bitvavo-api to your development device
- The [Bitvavo password for NPM] from the Exchange Backbone team vault in 1Password

## Test and Publish the SDK
After you have made your changes to the SDK, to publish Bitvavo SDK for Node.js:
1. **Test the package**
   1. Run the smoke tests in `<repo-root>/example/testApi.js`
2. **Release the SDK**
   1. Run the [Release workflow]. Use [Semver] to choose the version number.
   2. Fill out the notes in the [drafted release](https://github.com/bitvavo/node-bitvavo-api/releases).
   3. Publish the release.

The new version is published to https://www.npmjs.com/package/bitvavo.

[Bitvavo password for NPM]: https://start.1password.com/open/i?a=YUSMSDGGJBG5JDUAGUSBP4GYWM&v=asrum7nvbb2agfh3ob532ekbfy&i=f3i334rmzgxejycgufdwiiua3u&h=bitvavo.1password.com
[Release workflow]: https://github.com/bitvavo/node-bitvavo-api/actions/workflows/release.yml
[Semver]: https://semver.org/
