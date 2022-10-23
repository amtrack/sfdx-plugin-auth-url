import { flags, SfdxCommand } from '@salesforce/command';
import type { AnyJson } from '@salesforce/ts-types';
import { promises as fsPromises } from 'fs';
import type { FileResult } from 'tmp';
import { promisify } from 'util';
import child_process = require('child_process');
import tmp = require('tmp');
const exec = promisify(child_process.exec);

export default class ImportOrgUsingAuthUrlCommand extends SfdxCommand {
  public static description =
    'Authorize an org.\nThis is a wrapper for sfdx auth:sfdxurl:store without requiring a sfdxAuthUrl file.';

  public static examples = [
    '$ sfdx <%= command.id %> --setalias myOrg force://PlatformCLI::xxx@amazing-cloudy-374844.my.salesforce.com'
  ];

  public static args = [
    {
      name: 'sfdxAuthUrl'
    }
  ];

  protected static flagsConfig = {
    setalias: flags.string({
      description: 'set an alias for the authenticated org',
      char: 'a'
    }),
    setdefaultdevhubusername: flags.boolean({
      description:
        'set the authenticated org as the default dev hub org for scratch org creation',
      char: 'd'
    }),
    setdefaultusername: flags.boolean({
      description:
        'set the authenticated org as the default username that all commands run against',
      char: 's'
    })
  };

  protected tempObj!: FileResult;

  public async run(): Promise<AnyJson> {
    this.tempObj = tmp.fileSync();
    const sfdxAuthUrlFile = this.tempObj.name;
    const sfdxAuthUrl = this.args.sfdxAuthUrl;
    await fsPromises.writeFile(sfdxAuthUrlFile, sfdxAuthUrl);

    const args = ['--sfdxurlfile', sfdxAuthUrlFile];
    if (this.flags.setalias) {
      args.push(...['--setalias', this.flags.setalias]);
    }
    if (this.flags.setdefaultusername) {
      args.push('--setdefaultusername');
    }
    if (this.flags.setdefaultdevhubusername) {
      args.push('--setdefaultdevhubusername');
    }
    await exec(`sfdx auth:sfdxurl:store ${args.join(' ')}`);
    return {};
  }

  public async finally(): Promise<void> {
    if (this.tempObj) {
      this.tempObj.removeCallback();
    }
  }
}
