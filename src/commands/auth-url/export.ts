import { core, SfdxCommand } from '@salesforce/command';
import type { AnyJson } from '@salesforce/ts-types';
import { promisify } from 'util';
import child_process = require('child_process');
const exec = promisify(child_process.exec);

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-plugin-auth-url', 'export');

export default class ExportOrgUsingAuthUrlCommand extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx auth-url:export --targetusername myOrg@example.com
  force://PlatformCLI::xxx@amazing-cloudy-374844.my.salesforce.com
  `
  ];

  public static args = [];

  protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    const args = ['--verbose', '--json'];
    if (this.flags.targetusername) {
      args.push(...['--targetusername', this.flags.targetusername]);
    }
    const execResult = await exec(`sfdx force:org:display ${args.join(' ')}`);
    const stdoutJson = JSON.parse(execResult.stdout);
    this.ux.log(stdoutJson.result.sfdxAuthUrl);
    return { sfdxAuthUrl: stdoutJson.result.sfdxAuthUrl };
  }
}
