const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseBoolean = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;

  const isBoolean = (isFavourite) => ['true', 'false'].includes(isFavourite);

  if (isBoolean(isFavourite)) return isFavourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
