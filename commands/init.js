const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const cache = require('../cache.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('...')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply()

        const { client, guild, channel } = interaction

        let invites = []

        if (cache[guild.id]) {
            const { channelId, messageId } = cache[guild.id]

            const lbChannel = guild.channels.cache.get(channelId)
            if (lbChannel) {
                const lbMessage = lbChannel.messages.cache.get(messageId)
                if (lbMessage) {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: client.user.tag, iconURL: client.user.avatarURL() })
                        .setDescription(
                            `There's an ongoing leaderboard right now

                            [Go to message](https://discord.com/channels/${guild.id}/${channelId}/${messageId})`
                        )

                    interaction.editReply({ embeds: [embed] })
                    return
                }
            }

            invites = cache[guild.id].invites
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createInvite')
                    .setLabel('Create Invite')
                    .setStyle(ButtonStyle.Primary)
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.avatarURL() })
            .setTitle(`${guild.name}'s invites leaderboard`)
            .setThumbnail(guild.iconURL())
            .setTimestamp()

        if (invites.length) {
            for (let i = 0; i < 10; i++) {
                let invite = invites[i]
                if (!invite) break

                embed.addFields({ 
                    name: `${i + 1}. \`${invite.user.tag}\``,
                    value: `${invite.code} - **${invite.joins.length - invite.leaves.length} invites**`
                })
            }
        } else {
            embed.setDescription(
                `There are no records yet.

                Be the first to join the race!`
            )
        }

        const lbMessage = await interaction.editReply({ embeds: [embed], components: [row], fetchReply: true })

        cache[guild.id] = {
            channelId: channel.id,
            messageId: lbMessage.id,
            invites,
        }
    }
}