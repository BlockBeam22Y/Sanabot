const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const cache = require('../cache.json')
const { displayLeaderboard } = require('../auxFunctions')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return

        await interaction.deferReply({ ephemeral: true })

        const { guild, user } = interaction
        if (!cache[guild.id]) return
        
        const { channelId, messageId, invites } = cache[guild.id]
        if (interaction.message.id !== messageId) return

        let invite = invites.find(invite => invite.user.id === user.id) 

        if (!invite) {
            const newChannel = await guild.channels.create({
                name: user.username,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            })

            const newInvite = await guild.invites.create(newChannel, { maxAge: 0 })
            await guild.invites.fetch(newInvite)

            invite = {
                code: newInvite.code,
                user: {
                    id: user.id,
                    name: user.username,
                    tag: user.tag,
                },
                joins: 0,
                leaves: 0,
                logs: [],
                timeStamp: newInvite.createdTimestamp,
                channelId: newChannel.id,
            }
            invites.push(invite)

            const lbChannel = guild.channels.cache.get(channelId)
            const lbMessage = lbChannel.messages.cache.get(messageId)
            const lbEmbed = lbMessage.embeds[0]
            const editedEmbed = new EmbedBuilder()
                .setAuthor(lbEmbed.author)
                .setTitle(lbEmbed.title)
                .setThumbnail(lbEmbed.thumbnail.url)
                .setTimestamp(Date.parse(lbEmbed.timestamp))

            displayLeaderboard(editedEmbed, invites)

            await lbMessage.edit({ embeds: [editedEmbed], components: lbMessage.components })
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.avatarURL() })
            .setDescription(
                `Here's your invite link

                https://discord.gg/${invite.code}

                Invite as many people as you can!`
            )

        interaction.editReply({ embeds: [embed], ephemeral: true })
    }
}