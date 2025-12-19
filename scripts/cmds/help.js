const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.18",
    author: "Ktkhang | fixed by Soho",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View all commands",
    },
    longDescription: {
      en: "View all commands by category",
    },
    category: "info",
    guide: {
      en: "help | help <command>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // ===== SHOW ALL COMMANDS =====
    if (args.length === 0) {
      const categories = {};
      let msg = "📜 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒\n";

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;

        const category = value.config.category || "other";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      for (const category of Object.keys(categories)) {
        msg += `\n╭─────⭓ ${category.toUpperCase()}\n`;

        const cmds = categories[category].sort();
        for (let i = 0; i < cmds.length; i += 2) {
          msg += `│ ✧${cmds[i] || ""}   ✧${cmds[i + 1] || ""}\n`;
        }

        msg += `╰────────────⭓`;
      }

      msg += `\n\n⭔ Total Commands: ${commands.size}`;
      msg += `\n⭔ Use: ${prefix}help <command name>\n`;
      msg += `\n╭─✦OWNER: ARIYAN\n╰‣ Bangladesh`;

      const sent = await message.reply(msg);
      setTimeout(() => message.unsend(sent.messageID), 80000);
      return;
    }

    // ===== SINGLE COMMAND HELP =====
    const commandName = args[0].toLowerCase();
    const command =
      commands.get(commandName) ||
      commands.get(aliases.get(commandName));

    if (!command) {
      return message.reply(`❌ Command "${commandName}" not found.`);
    }

    const cfg = command.config;
    const roleText = roleTextToString(cfg.role);
    const usage =
      cfg.guide?.en
        ?.replace(/{he}/g, prefix)
        ?.replace(/{lp}/g, cfg.name) || "No guide";

    const response = `
╭─────────⭓
│ 🎀 Name : ${cfg.name}
│ 📝 Description : ${cfg.longDescription?.en || "No description"}
│ 🧑‍💻 Author : ${cfg.author || "Unknown"}
│ 📚 Guide : ${usage}
│ 🔢 Version : ${cfg.version || "1.0"}
│ 🔐 Role : ${roleText}
╰────────────⭓`;

    const sent = await message.reply(response);
    setTimeout(() => message.unsend(sent.messageID), 80000);
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "All users";
    case 1:
      return "Group admins";
    case 2:
      return "Bot admin";
    default:
      return "Unknown";
  }
	}
