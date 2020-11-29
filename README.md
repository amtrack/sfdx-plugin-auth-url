# sfdx-plugin-auth-url

> sfdx plugin for importing/exporting orgs using a Sfdx Auth Url

[![Actions Status](https://github.com/amtrack/sfdx-plugin-auth-url/workflows/Test%20and%20Release/badge.svg)](https://github.com/amtrack/sfdx-plugin-auth-url/actions)

This is a convenient wrapper for `sfdx force:org:display` and `sfdx force:auth:sfdxurl:store`.

## Use cases

Note: pbcopy/pbpaste is available on MacOS only. However you can copy/paste manually of course.

1. Authorizing a DevHub in CI environments

   Locally export the Sfdx Auth Url and save the content of your clipboard as an environment variable named `SFDX_AUTH_URL_DEVHUB` on your CI service.

   ```console
   npx sfdx-plugin-auth-url auth-url:export -u devhub | pbcopy
   ```

   Add the following to your build script

   ```console
   npx sfdx-plugin-auth-url auth-url:import -d -a devhub "${SFDX_AUTH_URL_DEVHUB}"
   ```

2. Quickly sharing orgs with colleagues

   ```console
   npx sfdx-plugin-auth-url auth-url:export -u myorg | pbcopy
   ```

   Send your colleague the content of your clipboard.
   Then your colleague can import it using

   ```console
   npx sfdx-plugin-auth-url auth-url:import -a myorg "$(pbpaste)"
   ```
