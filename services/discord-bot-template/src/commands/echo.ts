import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types.js';

export const Echo: Command = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('echo a message')
    .addStringOption((option) => option.setName('text').setRequired(true)),
  cooldown: 1,
  async execute(interaction) {
    const text = interaction.options.getString('text', true);
    return interaction.reply(`Your message: ${text}`);
  },
};
