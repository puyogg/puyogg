import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<
        SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandsOnlyBuilder,
        'addSubcommand' | 'addSubcommandGroup'
      >;
  cooldown: number;
  execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
