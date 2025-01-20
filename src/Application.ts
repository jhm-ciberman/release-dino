import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, Client, Events, GatewayIntentBits, SendableChannels } from 'discord.js';
import { mdimg } from 'mdimg';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { getDinoPhrases, getDinoVerb } from './dino-phrases';
import fs from 'node:fs/promises';
import { BaseLogger } from 'pino';

class Release {
    public title: string = '';
    public tag: string = '';
    public body: string = '';
    public repo: string = '';
    public url: string = '';
    public user: string = '';
    public userUrl: string = '';
    public repoUrl: string = '';

    public static fromEvent(event: ReleaseEvent): Release {
        const release = new Release();

        release.title = event.release.name || '';
        release.tag = event.release.tag_name || '';
        release.body = event.release.body || '';
        release.repo = event.repository.full_name || '';
        release.repoUrl = event.repository.html_url || '';
        release.url = event.release.html_url || '';
        release.user = event.sender.login || '';
        release.userUrl = event.sender.html_url || '';

        return release;
    }

    get repoOwner() {
        return this.repo.split('/')[0];
    }

    get repoName() {
        return this.repo.split('/')[1];
    }
}

/**
 * The application instance.
 */
export default class Application {

    public static readonly defaultLogger: BaseLogger = {
        info: console.info,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
        trace: console.trace,
        fatal: console.error,
        level: 'info',
        silent: () => {},
    };

    /**
     * The Discord bot token.
     */
    private _discordToken: string = process.env.DISCORD_TOKEN!;

    /**
     * The channel ID where to post the updates.
     */
    private _channelID: string = process.env.CHANNEL_ID!;

    /**
     * The Discord bot client instance.
     */
    private _client: Client<true> | null = null;

    /**
     * The channel where to post the updates.
     */
    private _channel: SendableChannels | null = null;

    /**
     * The logger instance.
     */
    public logger: BaseLogger = Application.defaultLogger;

    /**
     * Create a new instance of the application.
     */
    constructor() {
        //
    }

    private _initDiscordClient(): Promise<Client<true>> {
        return new Promise<Client<true>>((resolve, _reject) => {
            const client = new Client({
                intents: [GatewayIntentBits.Guilds],
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
        const cssText = `
            @import "https://cdn.jsdelivr.net/npm/normalize.css/normalize.min.css";
            @import "https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css";
            #mdimg-body { min-height: 100vh; }
            .markdown-body { padding: 2rem; }
        `;

        markdown = this._rewriteLinks(markdown);
        const outputFilename = path.resolve(__dirname, '../storage', randomUUID() + '.png');

        const executablePath = process.env.CHROME_BIN || undefined;

        this.logger.info('Rendering markdown to image...');
        this.logger.info(`Chrome Executable path: ${executablePath}`);

        const response = await mdimg({
            inputText: markdown || '(no description)',
            outputFilename,
            encoding: 'binary',
            type: 'png',
            cssTemplate: 'github',
            extensions: true,
            width: 1000,
            cssText,
            puppeteerProps: {
                browser: 'chrome',
                executablePath,
            },
        });

        return response.path!;
    }

    /**
     * Start the application.
     */
    public async startBot() {
        this.logger.info('Logging in into Discord... Please wait.');
        this._client = await this._initDiscordClient();
        this.logger.info(`Logged in as ${this._client.user?.username}!`);

        let channel = this._client.channels.cache.get(this._channelID) || null;

        if (!channel) {
            channel = await this._client.channels.fetch(this._channelID);
        }

        if (!channel) {
            throw new Error('Channel not found.');
        }

        if (!channel.isSendable()) {
            throw new Error('Channel is not sendable.');
        }

        this._channel = channel;
    }

    private async _sendDiscordMessage(release: Release, imagePath: string | null = null) {
        if (!this._client) return;
        if (!this._channel) return;

        const file = !imagePath ? null : new AttachmentBuilder(imagePath)
            .setName('release.png')
            .setDescription(`Release ${release.tag || release.title} in ${release.repoName}`);

        const phrases = getDinoPhrases(2).map(phrase => `> ${phrase}`).join('\n');

        const dinoPhrases = [
            `> **🦖 The Release Dino ${getDinoVerb()}:**`,
            phrases,
        ].join('\n');

        const content = [
            `## New release ${release.title || release.tag} in ${release.repoName}`,
            `- **🏷️ Tag**: ${release.tag || '—'}`,
            `- **📦 Repository**: ${release.repo || '—'}`,
            `- **👨‍💻 Released by**: @${release.user}`,
            `- **📖 Read more**: ${release.url || '—'}`,
            '',
            dinoPhrases,
        ].join('\n');

        const releaseButton = new ButtonBuilder()
            .setURL(release.url)
            .setLabel('View Release')
            .setStyle(ButtonStyle.Link)
            .setEmoji('🚀');

        const goToRepoButton = new ButtonBuilder()
            .setURL(release.repoUrl)
            .setLabel('Go to Repo')
            .setStyle(ButtonStyle.Link)
            .setEmoji('📦');

        const row = new ActionRowBuilder()
            .addComponents(releaseButton, goToRepoButton);

        await this._channel.send({
            files: file ? [file] : undefined,
            content,
            components: [row as never],
        });
    }

    /**
     * Handle the release event.
     * 
     * @param payload The release event payload.
     * @returns A promise that resolves when the event is handled.
     */
    public async handleReleaseEvent(payload: ReleaseEvent): Promise<void> {
        if (!this._client) return;

        this.logger.info('Received release event:');

        const onlyPublished = true;
        if (onlyPublished && payload.action !== 'published') {
            this.logger.info(`Ignoring non-published release. Action: ${payload.action}`);
            return;
        }

        this.logger.info('Rendering markdown...');
        const release = Release.fromEvent(payload);

        let imagePath: string | null = null;
        try {
            imagePath = await this.renderMarkdown(release.body);
        } catch (error) {
            this.logger.error(error, 'Failed to render markdown');
        }

        this.logger.info('Sending message...');
        await this._sendDiscordMessage(release, imagePath);
        this.logger.info('Message sent.');

        
        if (imagePath) {
            this.logger.info('Deleting image...');
            await fs.unlink(imagePath);
        }
    };
}

export interface ReleaseEvent { // It has more fields, but we only care about these
    action: 'created' | 'deleted' | 'edited' | 'prereleased' | 'published' | 'released' | 'unpublished';
    release: {
        id: number;
        url: string;
        html_url: string;
        tag_name: string;
        name: string;
        published_at: string;
        body: string;
    };
    repository: {
        name: string;
        full_name: string;
        html_url: string;
        owner: {
            login: string;
        };
    };
    sender: {
        login: string;
        html_url: string;
    };
}
