import { User } from '../utils/mongoose-utils.js';

export const createNewPayment = (request, reply) => {
  const newPayment = request.body;
  const paymentLink = `${req.protocol}://${request.hostname}/payments/${newPayment.userId}/${newPayment.paymentId}`;
  reply.send(paymentLink);
};

export const payUserPayment = async (request, reply) => {
  const user = await User.findById(request.params.id);
  const payment = user.payments.filter(
    (payment) => payment.paymentId == req.params.paymentId
  )[0];

  if (!payment) return reply.send({ ok: false, message: 'payment not found' });

  payment.status = 'fullfiled';

  const paymentIndex = user.payments.indexOf(payment);
  user.payments.splice(paymentIndex, 1);
  user.sends.push(payment);

  await user.save();
  reply.send({ ok: true, message: 'pagamento realizado' });
};

export const checkPayment = async (request, reply) => {
  const user = await User.findById(request.params.id);
  const payment = user.payments.filter(
    (payment) => payment.paymentId == req.params.paymentId
  )[0];

  if (!payment) return reply.send({ ok: true, message: 'pago' });
  reply.send({ ok: true, message: 'pendente' });
};
