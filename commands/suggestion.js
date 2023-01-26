const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { databaseClient } = require('../database/databaseClient.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sugestoes')
		.setDescription('Envie uma sugestão para o criador do Bot!')
        .addSubcommand(subcommand => 
            subcommand
                .setName('enviar')
                .setDescription('Enviar sugestão')
                .addStringOption(option => 
                    option.setName('sugestao')
                        .setDescription('Sua sugestão')
                        .setMinLength(15)
                        .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('listar')
                .setDescription('Lista as sugestões enviadas')),
	async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "enviar": {
                const suggestion = await interaction.options.get('sugestao').value;
                const userId = await interaction.user.id
        
                const dateObj = new Date();
                const currentDate = dateObj.toISOString().split('T')[0] + ' ' + dateObj.toTimeString().split(' ')[0];

                let sql = `INSERT INTO tickets (user, msg, created) VALUES (${userId}, "${suggestion}", "${currentDate}")`;
        
                databaseClient.query(sql, (err) => {
                    if (err) throw err;
                    console.log("Nova sugestão enviada.");
                })

		        await interaction.reply({ content: 'Sugestão enviada com sucesso!', ephemeral: true});
            } break;
            case "listar": {
                const userId = await interaction.user.id

                let sql = `SELECT * FROM tickets WHERE user LIKE ${userId} AND status LIKE "open"`
                

                databaseClient.query(sql, async (err, result, fields) => {
                    if (err) throw err;
                    if (!result.length) {
                        interaction.reply({ content: 'Nenhuma sugestão, experimente enviar uma!', ephemeral: true});
                    } else {
                        let fields = []
                        for (let i = 0; i < result.length; i++) {
                            const element = result[i];
                            fields.push({
                                name: `Sugestão #${element.id}`,
                                value: element.msg
                            })
                        }

                        const columnsEmbed = {
                            color: 0x0099FF,
                            title: "Suas sugestões",
                            fields: fields
                        }

                        await interaction.reply({embeds: [columnsEmbed], ephemeral:true});
                    }
                })
            } break;

            default: {
            } break;
        }
	},
};