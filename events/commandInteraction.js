const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return
    
        const command = interaction.client.commands.get(interaction.commandName)
    
        try {
            await command.execute(interaction)
        } catch (e) {
            console.error(e)
            await interaction.reply({ content: 'There was a problem executing this command.', ephemeral: true })
        }
    }
}