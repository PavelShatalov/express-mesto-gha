const { celebrate, Joi } = require('celebrate');
const JoiObjectId = require('joi-objectid')(Joi);

const regexImageLink = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const loginSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().regex(regexImageLink),
});

const getUserSchema = Joi.object().keys({
  userId: JoiObjectId(),
});

const updateUserSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
});

const updateAvatarSchema = Joi.object().keys({
  avatar: Joi.string().regex(regexImageLink),
});

const createCardSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required(),
});

const idCardSchema = Joi.object().keys({
  cardId: JoiObjectId(),
});

const login = celebrate({ body: loginSchema });
const getUser = celebrate({ params: getUserSchema });
const updateUser = celebrate({ body: updateUserSchema });
const updateAvatar = celebrate({ body: updateAvatarSchema });
const createCard = celebrate({ body: createCardSchema });
const idCard = celebrate({ params: idCardSchema });

module.exports = {
  login,
  getUser,
  updateUser,
  updateAvatar,
  createCard,
  idCard,
};
