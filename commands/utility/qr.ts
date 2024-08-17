import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("Generates a qr code with the text you provide!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setRequired(true)
        .setDescription(
          "Content of the QR code (can be a URL or any other string)",
        ),
    )
    .addNumberOption((option) =>
      option
        .setName("margin")
        .setRequired(false)
        .setDescription("Whitespace around QR image (default: 4)"),
    )
    .addNumberOption((option) =>
      option
        .setName("size")
        .setRequired(false)
        .setDescription(
          "Width and height dimension of the image (default: 150)",
        ),
    )
    .addStringOption((option) =>
      option
        .setName("dark")
        .setRequired(false)
        .setDescription(
          'Hex color code of "dark" QR grid cells (default: "000000")',
        ),
    )
    .addStringOption((option) =>
      option
        .setName("light")
        .setRequired(false)
        .setDescription(
          'Hex color code of "light" QR grid cells	(default: "FFFFFF")',
        ),
    )
    .addStringOption((option) =>
      option
        .setName("center_image_url")
        .setRequired(false)
        .setDescription(
          "URL of image to show in the center. Must be URL-encoded.",
        ),
    )
    .addNumberOption((option) =>
      option
        .setName("center_image_width")
        .setRequired(false)
        .setDescription("Width of center image in pixels"),
    )
    .addStringOption((option) =>
      option
        .setName("center_image_height")
        .setRequired(false)
        .setDescription("Height of center image in pixels"),
    )
    .addStringOption((option) =>
      option
        .setName("caption")
        .setRequired(false)
        .setDescription("Caption text to display below the QR code."),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    var reqURL = `https://quickchart.io/qr?text=${encodeURIComponent(interaction.options.getString("text") || "")}&margin=${interaction.options.getNumber("margin") || 4}&size=${interaction.options.getNumber("size") || 150}&dark=${interaction.options.getString("dark") || "000000"}&light=${interaction.options.getString("light") || "FFFFFF"}&caption=${interaction.options.getString("caption") || ""}`;

    const imgURL = interaction.options.getString("center_image_url");
    const imgWidth = interaction.options.getString("center_image_width");
    const imgHeight = interaction.options.getString("center_image_height");
    if (imgURL) {
      if (imgWidth) reqURL += `&centerImageWidth=${imgWidth}`;
      if (imgHeight) reqURL += `&centerImageHeight=${imgHeight}`;

      reqURL += `&centerImageUrl=${encodeURIComponent(imgURL)}`;
    }

    const res = await fetch(reqURL);
    if (!res.ok) {
      await interaction.reply("Failed to generate QR code.");
      return;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const attachment = new AttachmentBuilder(buffer, { name: "qr.png" });

    await interaction.reply({
      files: [attachment],
    });
  },
};
