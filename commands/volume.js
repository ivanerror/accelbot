const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Ganti volume")
    .addIntegerOption((option) =>
      option.setName("value").setDescription("Volume").setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const queue = await client.player.getQueue(interaction.guild);
    if (!queue) return interaction.editReply("Ga ada lagu yang di putar");
    const volume = interaction.options.getInteger("value");

    if (volume > 200) return interaction.editReply("Ojok akeh-akeh budeg cok");

    if (volume < 0) return interaction.editReply("Aneh-aneh malah mines");

    await queue.setVolume(volume);

    return interaction.editReply(`Volume di set ke ${volume}`);
  },
};
