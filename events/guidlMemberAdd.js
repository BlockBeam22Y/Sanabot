const { Events, EmbedBuilder } = require('discord.js')
const cache = require('../cache.json')
const { displayLeaderboard } = require('../auxFunctions')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const { guild, user } = member
        await guild.invites.fetch()

        if (!cache[guild.id]) return
        const { channelId, messageId, invites } = cache[guild.id]

        for (let i = 0; i < invites.length; i++) {
            guild.invites.cache.forEach(async guildInvite => {
                if (invites[i].code !== guildInvite.code) return

                if (invites[i].joins === guildInvite.uses) return

                if (invites[i].user.id === user.id) return

                invites[i].joins++
                invites[i].logs.push({
                    user: {
                        id: user.id,
                        name: user.username,
                        tag: user.tag,
                    },
                    timeStamp: member.joinedTimestamp,
                    value: 1,
                })
    
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
            })
        }
    }
}