import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

import { chunkArray } from './src/utils.js';
import { validatePhone, validateEmail } from './src/validators.js';

import { serviceTypes, messages, preferredContactMethods } from './src/constants.js';

config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const telegramUserId = process.env.TELEGRAM_USER_ID;
const bot = new TelegramBot(token, { polling: true });
const userStates = new Map();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates.set(chatId, {});

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: chunkArray(serviceTypes, 2)
    }
  };

  bot.sendMessage(chatId, messages.start, inlineKeyboard);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  let userState = userStates.get(chatId);

  if (!userState) {
    userState = {};
    userStates.set(chatId, userState);
  }

  // eslint-disable-next-line camelcase
  if (serviceTypes.map(({ callback_data }) => callback_data).includes(query.data)) {
    userState.serviceType = query.data;
    askPreferredContact(chatId);
  } else if (query.data.startsWith('contact_')) {
    userState.preferredContact = query.data.slice(8);
    if (userState.preferredContact === 'email') {
      bot.sendMessage(chatId, messages.emailEnter);
    } else {
      bot.sendMessage(chatId, messages.phoneEnter);
    }
  } else if (query.data === 'submit_request') {
    sendNotification(chatId, userState);
  }

  bot.answerCallbackQuery(query.id);
});

const askPreferredContact = (chatId) => {
  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'WhatsApp', callback_data: 'contact_whatsapp' },
          { text: 'Telegram', callback_data: 'contact_telegram' }
        ],
        [
          { text: 'Почта', callback_data: 'contact_email' },
          { text: 'Телефонный звонок', callback_data: 'contact_phone' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, messages.preferredContact, inlineKeyboard);
};

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const userState = userStates.get(chatId);

    if (userState.serviceType && !userState.contactInfo) {
      if (userState.preferredContact === 'email') {
        if (validateEmail(msg.text)) {
          userState.contactInfo = msg.text;
          sendEnterMessage(chatId);
        } else {
          bot.sendMessage(chatId, messages.emailError);
        }
      } else {
        if (validatePhone(msg.text)) {
          userState.contactInfo = msg.text;
          sendEnterMessage(chatId);
        } else {
          bot.sendMessage(chatId, messages.phoneError);
        }
      }
    }
  }
});

const sendEnterMessage = (chatId) => {
  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [[{ text: 'Отправить заявку', callback_data: 'submit_request' }]]
    }
  };
  bot.sendMessage(chatId, messages.sendEnter, inlineKeyboard);
};

const sendNotification = (chatId, userState) => {
  const preferredContactMethod = preferredContactMethods[userState.preferredContact];

  const contactInfo = userState.preferredContact === 'email' ? 'Email' : 'Номер телефона';

  bot
    .sendMessage(
      telegramUserId,
      `Новая заявка:\nТип услуги: ${userState.serviceType}\nПредпочтительный способ связи: ${preferredContactMethod}\n${contactInfo}: ${userState.contactInfo}`
    )
    .then(() => {
      bot.sendMessage(chatId, messages.sendSuccess);
    })
    .catch(() => {
      bot.sendMessage(chatId, messages.sendError);
    });
};

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
