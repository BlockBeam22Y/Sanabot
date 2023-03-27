const fs = require('node:fs')
const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return
        const cache = require('../cache.json')
        const { messageId, invites } = cache[interaction.guild.id]

        let invite = invites.find(invite => invite.user.id === interaction.user.id) 

        if (!invite) {
            const newChannel = await interaction.guild.channels.create({
                name: interaction.user.tag,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            })

            const newInvite = await interaction.guild.invites.create(newChannel, { maxAge: 0 })

            invite = {
                code: newInvite.code,
                user: {
                    id: interaction.user.id,
                    name: interaction.user.name,
                    tag: interaction.user.tag,
                },
                joins: 0,
                leaves: 0,
                timeStamp: newInvite.createdTimestamp,
                channelId: newChannel.id,
            }
            invites.push(invite)

            const lbMessage = interaction.channel.messages.cache.get(messageId)
            const editedEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}'s invites leaderboard`)
                .setThumbnail(interaction.guild.iconURL())

            for (let i = 0; i < 10; i++) {
                let invite = invites[i]

                if (invite) {
                    editedEmbed.addFields({ 
                        name: `${i + 1}. \`${invite.user.tag}\``,
                        value: `${invite.code} - **${invite.joins - invite.leaves} invites**`
                    })
                }
            }

            lbMessage.edit({ embeds: [editedEmbed], components: lbMessage.components })
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription(
                `Here's your invite link

                https://discord.gg/${invite.code}

                Invite as many people as you can!`
            )

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}