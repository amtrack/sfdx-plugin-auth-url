import { SfCommand, requiredOrgFlagWithDeprecations } from '@salesforce/sf-plugins-core';
import { promisify } from 'util';
import child_process = require('child_process');
const exec = promisify(child_process.exec);

export type ExportOrgUsingAuthUrlResult = {
  sfdxAuthUrl: string;
};

export class ExportOrgUsingAuthUrlCommand extends SfCommand<ExportOrgUsingAuthUrlResult> {
  public static description =
    'Print a Sfdx Auth Url.\nThis is a wrapper for sfdx force:org:display --verbose.';

  public static examples = [
    `$ <%= config.bin %> <%= command.id %> --targetusername myOrg@example.com
  force://PlatformCLI::xxx@amazing-cloudy-374844.my.salesforce.com
  `
  ];

  public static readonly flags = {
    "target-org": requiredOrgFlagWithDeprecations,
  }

  public async run(): Promise<ExportOrgUsingAuthUrlResult> {
    const { flags } = await this.parse(ExportOrgUsingAuthUrlCommand);
    const args = ['--verbose', '--json'];
    if (flags['target-org']) {
      args.push(...['--targetusername', flags["target-org"].getUsername()!]);
    }
    const execResult = await exec(`sfdx force:org:display ${args.join(' ')}`);
    const { result } = JSON.parse(execResult.stdout);
    this.log(result.sfdxAuthUrl);
    return { sfdxAuthUrl: result.sfdxAuthUrl };
  }
}
