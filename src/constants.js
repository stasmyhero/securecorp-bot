export const serviceTypes = [
  { text: 'Собственная безопасность', callback_data: 'personal_security' },
  { text: 'Проверка контрагентов', callback_data: 'contractor_check' },
  {
    text: 'Анализ безопасности предприятия',
    callback_data: 'enterprise_analysis'
  },
  {
    text: 'Проведение служебной проверки',
    callback_data: 'security_investigation'
  },
  {
    text: 'Промышленный шпионаж',
    callback_data: 'enterprise_analysis'
  },
  {
    text: 'Другое',
    callback_data: 'other'
  }
];

export const messages = {
  start: 'Привет, я бот компании SecureCorp, постараю помочь вам с выбором заявки! Для начала, выберите тип услуги:',
  phoneEnter: 'Введите ваш номер телефона, начиная с +7:',
  phoneError: 'Некорректный номер телефона. Введите номер телефона заново',
  sendEnter: 'Нажмите кнопку ниже, чтобы отправить заявку.',
  sendSuccess: 'Заявка успешно отправлена! Мы ответим вам в ближайшее время.',
  sendError: 'Ошибка! Заявка не отправлена.',
  emailEnter: 'Введите Ваш еmail-адрес для связи',
  emailError: 'Некорректный email! Введите email заново',
  preferredContact: 'Принято.! Как с вами связаться?'
};

export const preferredContactMethods = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  email: 'Почта',
  phone: 'Телефонный звонок'
};
