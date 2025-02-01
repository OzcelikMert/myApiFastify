const getSelectString = (...fields: string[]) => {
  return fields.join(' ');
};

const author = getSelectString(
  '_id',
  'name',
  'url',
  'image',
  'facebook',
  'instagram',
  'twitter'
);

const term = getSelectString('_id', 'typeId', 'postTypeId', 'contents');

const navigation = getSelectString('_id', 'contents');

export const PopulationSelects = {
  author: author,
  term: term,
  navigation: navigation,
};
