const fs = require('node:fs')
const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('...')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const cache = require('../cache.json')
        cache.channelId = interaction.channel.id

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createInvite')
                    .setLabel('Create Invite')
                    .setStyle(ButtonStyle.Primary)
            )

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}'s invites leaderboard`)
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`There are no records yet.\nBe the first to join the race!`)

        const lbMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
        cache.messageId = lbMessage.id

        fs.writeFileSync('../cache.json', JSON.stringify(cache))
    }
}