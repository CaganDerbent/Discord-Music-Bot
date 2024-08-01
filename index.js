const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YouTubePlugin } = require('@distube/youtube');
const token  =  process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YouTubePlugin()],
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'command');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
 
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

try{
	client.distube
    .on('playSong', (queue, song) => {
        const songList = queue.songs.map((s, i) => `${i + 1}. ${s.name} - ${s.formattedDuration}`).join('\n');
        queue.textChannel.send(`Playing \`${song.name}\` - \`${song.formattedDuration}\`\n\nCurrent Queue:\n${songList}`)
})
    .on('addSong', (queue, song) => {
        const songList = queue.songs.map((s, i) => `${i + 1}. ${s.name} - ${s.formattedDuration}`).join('\n');
        queue.textChannel.send(`Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue by \`${song.user.tag}\`\n\nCurrent Queue:\n${songList}`);
    })
    //.on('error', (channel, error) => channel.send(`An error encountered: ${error.message}`));

}
catch(err){
	console.log(err)
}

