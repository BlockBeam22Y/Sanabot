const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const cache = require('../cache.json')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return

        await interaction.deferReply({ ephemeral: true })

        const { guild, user, client } = interaction
        const { channelId, messageId, invites } = cache[guild.id]

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
                joins: [],
                leaves: [],
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

            if (invites.length) {
                for (let i = 0; i < 10; i++) {
                    let invite = invites[i]
                    if (!invite) break

                    editedEmbed.addFields({ 
                        name: `${i + 1}. \`${invite.user.tag}\``,
                        value: `${invite.code} - **${invite.joins.length - invite.leaves.length} invites**`
                    })
                }
            } else {
                editedEmbed.setDescription(
                    `There are no records yet.
    
                    Be the first to join the race!`
                )
            }

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