const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song'),

    async execute(interaction) {
        try {
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                await interaction.reply('You need to be in a voice channel to skip music!');
                return;
            }

            interaction.client.distube.skip(voiceChannel);
            await interaction.reply('Skipped the current song!');

            
        } catch (err) {
            await interaction.reply('An error occurred while skipping the song.');
            console.error(err);
        }
    },
};