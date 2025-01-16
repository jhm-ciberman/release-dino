import { Client, Events, GatewayIntentBits } from 'discord.js';
import { mdimg } from 'mdimg';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

/**
 * The application instance.
 */
export default class Application {

    /**
     * The Discord bot token.
     */
    private _discordToken: string = process.env.DISCORD_TOKEN!;

    /**
     * The Discord bot client ID.
     */
    private _discordClientId: string = process.env.DISCORD_CLIENT_ID!;

    /**
     * The Guid ID where the bot is running.
     */
    private _guildId: string = process.env.GUILD_ID!;

    /**
     * The channel ID where to post the updates.
     */
    private _channelID: string = process.env.CHANNEL_ID!;

    /**
     * Create a new instance of the application.
     */
    constructor() {
        //
    }

    private _initDiscordClient(): Promise<Client<true>> {        
        return new Promise<Client<true>>((resolve, _reject) => {
            const client = new Client({ 
                intents: [ GatewayIntentBits.Guilds ],
            });

            client.once(Events.ClientReady, readyClient => {
                resolve(readyClient);
            });

            client.login(this._discordToken);
        });
    }

    private _rewriteLinks(markdown: string): string {
        // 1. Rewrite github links to PRs as [#123](...)
        markdown = markdown.replace(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/g, (match, owner, repo, pr) => {
            return `[#${pr}](${match})`;
        });

        // 2. Rewrite compare links as [Tag1...Tag2](...)
        markdown = markdown.replace(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^/]+)/g, (match, owner, repo, tags: string) => {
            return `[${tags}](${match})`;
        });

        return markdown;
    }


    public async renderMarkdown(markdown: string): Promise<string> {
        const version = 'v2024.01.02a';
        const cssText = `
            @import "https://cdn.jsdelivr.net/npm/normalize.css/normalize.min.css";
            @import "https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css";
            #mdimg-body { min-height: 100vh; }
            .markdown-body { padding: 2rem; }
        `;

        markdown = this._rewriteLinks(markdown);

        const filename = randomUUID() + '-' + version.replaceAll('.', '-').toLowerCase();
        const folder = path.resolve(__dirname, '../storage');
        
        const response = await mdimg({
            inputText: `# ${version}\n\n${markdown}`,
            outputFilename: `${folder}/${filename}.png`,
            encoding: 'binary',
            type: 'png',
            cssTemplate: 'github',
            extensions: true,
            width: 1000,
            cssText,
        });

        return response.path!;
    }



    /**
     * Start the application.
     */
    public async start() {
        console.info('Logging in... Please wait.');
        //const client = await this._initDiscordClient();

        //console.info(`Logged in as ${client.user?.username}!`);

        const markdown = `
<!-- Release notes generated using configuration in .github/release.yml at main -->

## What's Changed
### New Features 🚀
* Introduce new sampled algorithm for performance score in AdCreatives by @jhm-ciberman in https://github.com/playsaurus-inc/playsaurus-web/pull/760
### Bug Fixes 🐛
* [FIX] Server Error when no multiplier offset is present by @PauloAK in https://github.com/playsaurus-inc/playsaurus-web/pull/753
* Fix validation rules for Product SKU in Nova by @jhm-ciberman in https://github.com/playsaurus-inc/playsaurus-web/pull/759
### Dependency Updates 📦
* Bump vite from 6.0.2 to 6.0.6 by @dependabot in https://github.com/playsaurus-inc/playsaurus-web/pull/758
* Bump laravel-precognition-alpine from 0.5.13 to 0.5.14 by @dependabot in https://github.com/playsaurus-inc/playsaurus-web/pull/757
* Bump axios from 1.7.8 to 1.7.9 by @dependabot in https://github.com/playsaurus-inc/playsaurus-web/pull/754
* Bump alpinejs from 3.14.3 to 3.14.8 by @dependabot in https://github.com/playsaurus-inc/playsaurus-web/pull/756
* Bump @alpinejs/mask from 3.14.5 to 3.14.8 by @dependabot in https://github.com/playsaurus-inc/playsaurus-web/pull/755


**Full Changelog**: https://github.com/playsaurus-inc/playsaurus-web/compare/v2024.12.30b...v2024.01.02a
`;

        const path = await this.renderMarkdown(markdown);
        console.log(path);
    }
}
