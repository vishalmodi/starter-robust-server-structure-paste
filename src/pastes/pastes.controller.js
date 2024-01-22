const pastes = require("../data/pastes-data");

function list(req, res) {
  const { userId } = req.params;
  // res.json({ data: pastes });
  res.json({
    data: pastes.filter(
      userId ? (paste) => paste.user_id == userId : () => true
    ),
  });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
}

function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

function create(req, res) {
  let lastPostId = pastes.reduce(
    (maxId, paste) => Math.max(maxId, paste.id),
    0
  );
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;

  if (text) {
    const newPaste = {
      id: lastPostId + 1,
      name,
      syntax,
      expiration,
      exposure,
      text,
    };

    pastes.push(newPaste);

    res.status(201).json({ data: newPaste });
  } else {
    res.sendStatus(400);
  }
}

function pasteExists(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id == pasteId);

  if (foundPaste) {
    res.locals.paste = foundPaste;
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`,
  });
}

function read(req, res, next) {
  let foundPaste = res.locals.paste;
  // const { pasteId } = req.params;
  // const foundPaste = pastes.find((paste) => paste.id == pasteId);

  res.json({ data: foundPaste });
}

function update(req, res, next) {
  let foundPaste = res.locals.paste;
  // const { pasteId } = req.params;
  // const foundPaste = pastes.find((paste) => paste.id == Number(pasteId));
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  // update the paste
  foundPaste.name = name;
  foundPaste.syntax = syntax;
  foundPaste.expiration = expiration;
  foundPaste.exposure = exposure;
  foundPaste.text = text;

  res.json({ data: foundPaste });
}

function destroy(req, res, next) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((p) => p.id == pasteId);
  const deletedPaste = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    syntaxPropertyIsValid,
    create,
  ],
  read: [pasteExists, read],
  update: [
    pasteExists,
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    update,
  ],
  delete: [pasteExists, destroy],
  list,
};
