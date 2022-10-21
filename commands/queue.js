const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Lihat antrian"),
  run: async ({ client, interaction }) => {
    const queue = await client.player.getQueue(interaction.guild);
    const song = await client.player.getQueue(interaction.guild).nowPlaying();
    if (!queue) return interaction.editReply("Ga ada lagu yang di putar");
    const embed = new EmbedBuilder();
    const tracks = queue.tracks.map((track, i) => {
      return `${i + 1}. ${track.title} - ${track.author}`;
    });
    // current song playing
    if (tracks.length < 1)
      return interaction.editReply(
        `Currently playing: ${song.title} - ${song.author}`
      );
    embed
      .setTitle("Antrian Lagu")
      .setDescription(tracks.join("\n"))
      .setThumbnail(queue.tracks[0].thumbnail)
      .addFields({
        name: "Now Playing",
        value: `${song.title} - ${song.author}`,
      });
    return interaction.editReply({ embeds: [embed] });
  },
};
