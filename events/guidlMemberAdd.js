const { Events, EmbedBuilder } = require('discord.js')
const cache = require('../cache.json')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const { guild, user } = member
        await guild.invites.fetch()

        const { channelId, messageId, invites } = cache[guild.id]

        for (let i = 0; i < invites.length; i++) {
            let inviteUsed = guild.invites.cache.find(guildInvite => invites[i].code === guildInvite.code && invites[i].joins.length !== guildInvite.uses)

            if (inviteUsed) {
                invites[i].joins.push(user.id)
    
                const lbChannel = guild.channels.cache.get(channelId)
                const lbMessage = lbChannel.messages.cache.get(messageId)
                const editedEmbed = new EmbedBuilder()
                    .setTitle(`${guild.name}'s invites leaderboard`)
                    .setThumbnail(guild.iconURL())
    
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
        }
    }
}