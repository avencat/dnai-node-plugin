// @flow

export default {
  firstLetterToUpperCase: (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`,

  fromUnderscoreToCamelCase:
    (str: string) => str.toLowerCase().replace(/(_[a-z])/g, $1 => $1.toUpperCase().replace('_', '')),

  getFirstWord: (str: string) => (str.indexOf('.') <= -1 ? str : str.substring(0, str.indexOf('.'))),

  getStringAfterFirstWord: (str: string) => (str.indexOf('.') - 1 <= -1 ? str : str.substr(str.indexOf('.') + 1)),
};
