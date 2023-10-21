import { Args } from '@oclif/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { promises as fsPromises } from 'fs';
import type { FileResult } from 'tmp';
import { promisify } from 'util';
import child_process = require('child_process');
import tmp = require('tmp');
const exec = promisify(child_process.exec);

export class ImportOrgUsingAuthUrlCommand extends SfCommand<void> {
  public static description =
    'Authorize an org.\nThis is a wrapper for sfdx auth:sfdxurl:store without requiring a sfdxAuthUrl file.';

  public static examples = [
    '$ <%= config.bin %> <%= command.id %> --setalias myOrg force://PlatformCLI::xxx@amazing-cloudy-374844.my.salesforce.com'
  ];

  public static readonly args = {
    sfdxAuthUrl: Args.string()
  };

  public static readonly flags = {
    setalias: Flags.string({
      description: 'set an alias for the authenticated org',
      char: 'a'
    }),
    setdefaultdevhubusername: Flags.boolean({
      description:
        'set the authenticated org as the default dev hub org for scratch org creation',
      char: 'd'
    }),
    setdefaultusername: Flags.boolean({
      description:
        'set the authenticated org as the default username that all commands run against',
      char: 's'
    })
  };

  protected tempObj!: FileResult;

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(ImportOrgUsingAuthUrlCommand);
    this.tempObj = tmp.fileSync();
    const sfdxAuthUrlFile = this.tempObj.name;
    if (!args.sfdxAuthUrl) {
      throw new Error("missing argument sfdxAuthUrl");
    }
    const sfdxAuthUrl = args.sfdxAuthUrl;
    await fsPromises.writeFile(sfdxAuthUrlFile, sfdxAuthUrl);

    const orgLoginArgs = ['--sfdxurlfile', sfdxAuthUrlFile];
    if (flags.setalias) {
      orgLoginArgs.push(...['--setalias', flags.setalias]);
    }
    if (flags.setdefaultusername) {
      orgLoginArgs.push('--setdefaultusername');
    }
    if (flags.setdefaultdevhubusername) {
      orgLoginArgs.push('--setdefaultdevhubusername');
    }
    await exec(`sfdx auth:sfdxurl:store ${orgLoginArgs.join(' ')}`);
  }

  public async finally(): Promise<void> {
    if (this.tempObj) {
      this.tempObj.removeCallback();
    }
  }
}
