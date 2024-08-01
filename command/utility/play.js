const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Youtube/Spotify URL or song name.')
                .setRequired(true)),

    async execute(interaction) {

        try{
            const userInput = interaction.options.getString('song');

        if (!userInput) {
            await interaction.reply('Input field is empty!');
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to play music!');
            return;
        }

        await interaction.reply(`Playing: ${userInput}`);
        interaction.client.distube.play(voiceChannel, userInput, {
            textChannel: interaction.channel,
            member: interaction.member,
        });

        }
        catch(err){
            await interaction.reply(err);
        }
        
    },
};


