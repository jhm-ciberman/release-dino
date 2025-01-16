import { Client, Events, GatewayIntentBits } from 'discord.js';

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

    /**
     * Start the application.
     */
    public async start() {
        console.info('Logging in... Please wait.');
        const client = await this._initDiscordClient();

        console.info(`Logged in as ${client.user?.username}!`);
    }
}
