const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("memuat lagu dari youtube.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("aste Url Youtube disini")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL LAGU YOUTUBE")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Paste URL Playlist Youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL PLAYLIST YOUTUBE")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("katakunci")
        .setDescription("Cari lagu berdasarkan keyword")
        .addStringOption((option) =>
          option
            .setName("katakunci")
            .setDescription("Kata Kunci pencarian")
            .setRequired(true)
        )
    ),
  run: async ({ client, interaction }) => {
    console.log(interaction.member);
    if (!interaction.member.voice.channel)
      return interaction.editReply("Masuk Dulu Channel Anjing");

    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    // let embed = new MessageEmbed();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("Ga Nemu Bos!");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);

    //   embed
    //     .setDescription(`${song.title} ditambahkan di playlist`)
    //     .setThumbnail(song.thumbnail)
    //     .setFooter({ text: `Durasi musik : ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
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
    } else if (interaction.options.getSubcommand() === "katakunci") {
      let url = interaction.options.getString("katakunci");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0)
        return interaction.editReply("No results");

      const song = result.tracks[0];
      await queue.addTrack(song);
    //   embed
    //     .setDescription(
    //       `**[${song.title}](${song.url})** has been added to the Queue`
    //     )
    //     .setThumbnail(song.thumbnail)
    //     .setFooter({ text: `Duration: ${song.duration}` });
    }
    if (!queue.playing) await queue.play();
    // await interaction.editReply({
    //   embeds: [embed],
    // });
  },
};
