const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { validURL, isYoutubePlaylist } = require("../utils/validator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Memuat lagu")
    .addStringOption((option) =>
      option
        .setName("value")
        .setDescription("URL LAGU YOUTUBE")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    console.log(interaction.member);
    if (!interaction.member.voice.channel)
      return interaction.editReply("Masuk Channel dulu Anjing");

    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    const embed = new EmbedBuilder();

    const value = interaction.options.getString("value");
    if (validURL(value)) {
      if (isYoutubePlaylist(value)) {
        const result = await client.player.search(value, {
          requestedBy: interaction.user,
          searchEngine: QueryType.YOUTUBE_PLAYLIST,
        });

        if (result.tracks.length === 0)
          return interaction.editReply("No results");

        const playlist = result.playlist;
        await queue.addTracks(result.tracks);
        embed
          .setDescription(
            `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`
          )
          .setThumbnail(playlist.thumbnail);
      }
      const result = await client.player.search(value, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("Ga Nemu Bos!");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);
    } else {
      const result = await client.player.search(value, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0)
        return interaction.editReply("No results");

      const song = result.tracks[0];
      await queue.addTrack(song);

      console.log(interaction.user);

      embed
        .setColor("0xFF77BC")
        .setTitle("Now Playing")
        .setThumbnail(song.thumbnail)
        .setDescription(`[${song.title}](${song.url})`)
        .addFields(
          {
            name: "Requested By",
            value: interaction.user.username,
          },
          {
            name: "Duration",
            value: song.duration,
          },
        );
    }

    if (!queue.playing) await queue.play();
    await interaction.editReply({ embeds: [embed] });
  },
};
