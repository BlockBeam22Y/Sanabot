const fs = require('node:fs')
const path = require('node:path')
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] })

const commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command)
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = commands.get(interaction.commandName)

    try {
        await command.execute(interaction)
    } catch (e) {
        console.error(e)
        interaction.reply({ content: 'Hubo un problema ejecutando este comando', ephemeral: true })
    }
})

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(token)