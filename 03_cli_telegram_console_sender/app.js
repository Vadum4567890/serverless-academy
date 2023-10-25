const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');
const fs = require('fs');

const token = '6737222028:AAH11OJyUXl0tlRdpp-yxaUpji8JmkTdTzg';
const chatId = '6737222028'; 

const bot = new TelegramBot(token, { polling: true });

let messages = [];

if (fs.existsSync('msg.json')) {
  messages = JSON.parse(fs.readFileSync('msg.json'));
}

bot.on('message', (msg) => {
  const messageInfo = {
    chatId: msg.chat.id,
    messageId: msg.message_id,
    text: msg.text,
    date: new Date(msg.date * 1000).toISOString(),
  };

  messages.push(messageInfo);

  if (msg.text === '/start') {
    fs.writeFileSync('msg.json', JSON.stringify(messages, null, 2));
  }
});

program
  .command('send-message <message...>')
  .alias('sm')
  .description('Send a message via the Telegram bot')
  .action((message) => {
    const latestChatId = messages.length > 0 ? messages[messages.length - 1].chatId : chatId;
    const completeMessage = message.join(' ');
    bot.sendMessage(latestChatId, completeMessage).then(() => {
      setTimeout(() => {
        process.exit();
      }, 500);
    });
  });

program
  .command('send-photo <path>')
  .alias('sp')
  .description('Send a local photo via the Telegram bot')
  .action((path) => {
    const latestChatId = messages.length > 0 ? messages[messages.length - 1].chatId : chatId;
    const photo = fs.createReadStream(path);
    bot.sendPhoto(latestChatId, photo).then(() => {
      setTimeout(() => {
        process.exit();
      }, 500);
    });
  });

program.parse(process.argv);
