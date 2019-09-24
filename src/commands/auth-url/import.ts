import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { promises as fsPromises } from 'fs';
import { promisify } from 'util';
const os = require('os');
const path = require('path');
const child_process = require('child_process');
const exec = promisify(child_process.exec);
const rimraf = promisify(require('rimraf'));

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-plugin-auth-url', 'import');

export default class ImportOrgUsingAuthUrlCommand extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx auth-url:import --setalias myOrg force://PlatformCLI::xxx@amazing-cloudy-374844.my.salesforce.com'
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

  protected tempDir;

  public async run(): Promise<AnyJson> {
    this.tempDir = await fsPromises.mkdtemp(os.tmpdir());
    const sfdxAuthUrlFile = path.join(this.tempDir, 'sfdxAuthUrl.txt');
    // TODO: implement using STDIN
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
    await exec(`sfdx force:auth:sfdxurl:store ${args.join(' ')}`);
    return {};
  }

  public async finally() {
    if (this.tempDir) {
      rimraf(this.tempDir);
    }
  }
}
