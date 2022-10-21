const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip lagu"),
    run: async ({ client, interaction }) => {
        const queue = await client.player.getQueue(interaction.guild);
        if (!queue) return interaction.editReply("Ga ada lagu yang di putar");
        await queue.skip();
        return interaction.editReply("Lagu di skip");
    }
}