const { Events, EmbedBuilder } = require('discord.js')
const cache = require('../cache.json')
const { displayLeaderboard } = require('../auxFunctions')

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const { guild, user } = member

        if (!cache[guild.id]) return
        const { channelId, messageId, invites } = cache[guild.id]

        for (let i = 0; i < invites.length; i++) {
            invites[i].logs.forEach(async log => {
                if (log.user.id !== user.id) return

                if (log.timeStamp !== member.joinedTimestamp) return

                invites[i].leaves++
                invites[i].logs.push({
                    user: log.user,
                    timeStamp: log.timeStamp,
                    value: -1,
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
            });
        }
    }
}