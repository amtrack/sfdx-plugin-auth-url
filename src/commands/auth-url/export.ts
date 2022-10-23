import { SfdxCommand } from '@salesforce/command';
import type { AnyJson } from '@salesforce/ts-types';
import { promisify } from 'util';
import child_process = require('child_process');
const exec = promisify(child_process.exec);

export default class ExportOrgUsingAuthUrlCommand extends SfdxCommand {
  public static description =
    'Print a Sfdx Auth Url.\nThis is a wrapper for sfdx force:org:display --verbose.';

  public static examples = [
    `$ sfdx <%= command.id %> --targetusername myOrg@example.com
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
