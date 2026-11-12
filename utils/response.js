// Helpers de respuesta estandarizados para la API.
const ok = (res, data, status = 200) => res.status(status).json({ data });

const created = (res, data) => res.status(201).json({ data });

const paginated = (res, data, meta) =>
  res.status(200).json({ data, meta });

const fail = (res, status, code, message) =>
  res.status(status).json({ error: { code, message } });

const noContent = (res) => res.status(204).send();

module.exports = { ok, created, paginated, fail, noContent };
