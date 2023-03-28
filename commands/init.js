const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const cache = require('../cache.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('...')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const guild = interaction.guild

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createInvite')
                    .setLabel('Create Invite')
                    .setStyle(ButtonStyle.Primary)
            )

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name}'s invites leaderboard`)
            .setThumbnail(guild.iconURL())
            .setDescription(
                `There are no records yet.

                Be the first to join the race!`
            )

        const lbMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })

        cache[guild.id] = {
            channelId: interaction.channel.id,
            messageId: lbMessage.id,
            invites: [],
        }
    }
}