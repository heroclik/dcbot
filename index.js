const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity({
    type: ActivityType.Custom,
    name: 'customstatus',
    state: '🤖 Working For Stupid Owner'
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    console.error('Received an interaction that is not a command.');
    return;
  }

  const { commandName, options } = interaction;

  if (interaction.commandName === 'getuser') {
    // Use the correct option type for a string parameter
    const user_id = interaction.options.get('user_id').value;

    console.log('Received user_id:', user_id);

    if (!user_id) {
      await interaction.reply('Please provide a user_id.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/user/getuser/${user_id}`);
      const responseData = response.data;
      await interaction.reply(`${JSON.stringify(responseData)}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while calling the API.');
    }
  }


  if (interaction.commandName === 'getproject') {
    // Use the correct option type for a string parameter
    const project_id = interaction.options.get('project_id').value;

    console.log('Received project_id:', project_id);

    if (!project_id) {
      await interaction.reply('Please provide a project_id.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/project/getproject/${project_id}`);
      const responseData = response.data;
      await interaction.reply(`${JSON.stringify(responseData)}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while calling the API.');
    }
  }

  if (interaction.commandName === 'login') {
    // Use the correct option type for a string parameter
    const username = interaction.options.get('username').value;
    const password = interaction.options.get('password').value;

    console.log(username,password);

    if (!username,!password) {
      await interaction.reply('Please provide a username and password.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/auth/login`,{username,password});
      const responseData = response.data;
      await interaction.reply(`${JSON.stringify(responseData)}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while calling the API.');
    }
  }
  if (interaction.commandName === 'settimer') {
    const timeInSeconds = options.getInteger('time');
    const targetUser = options.getMember('user');

    if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
        return interaction.reply({ content: 'Please provide a valid time in seconds.', ephemeral: true });
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });
    }

    if (!targetUser) {
        return interaction.reply({ content: 'Please mention the user you want to disconnect.', ephemeral: true });
    }

    await interaction.reply({ content: `I will disconnect ${targetUser.user.username} in ${timeInSeconds} seconds.`, ephemeral: true });

    // Set a timer to disconnect the target user after the specified time
    setTimeout(() => {
      targetUser.voice.setChannel(null);
      interaction.followUp({ content: `${targetUser.user.username} has been disconnected from the voice channel.`, ephemeral: true });
  }, timeInSeconds * 1000); // Convert seconds to milliseconds
}
});



client.login(process.env.TOKEN);
