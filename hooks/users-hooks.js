import { mongooseUtils, objectUtils } from '../utils/index.js';
import { User } from '../utils/mongoose-utils.js';

export const emailAlreadyRegistered = async (request, reply) => {
  const { email } = request.body;
  const registered = await User.exists({ email });

  if (registered)
    return reply.send({ ok: false, message: 'email already registered' });
};

export const emailNotRegistered = async (request, reply) => {
  const { email } = request.body;
  const registered = await User.exists({ email });

  if (!registered)
    return reply.send({ ok: false, message: 'email not registered' });
};

export const checkPassword = async (request, reply) => {
  const { password, email } = request.body;
  const user = await User.findOne({ email });

  if (user.password !== password)
    return reply.send({ ok: false, message: 'wrong password' });
};

export const userExists = async (request, reply) => {
  const _id = request.params.id;
  const exists = await User.exists({ _id });

  if (!exists) return reply.send({ ok: false, message: 'user not found' });
};
