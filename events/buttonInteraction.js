const { Events, EmbedBuilder } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return
        const cache = require('../cache.json')

        const invite = await interaction.guild.invites.create(cache.channelId, { maxAge: 0 })

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