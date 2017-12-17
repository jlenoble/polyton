import {warn} from 'explanation';

const isValidOption = option => {
  switch (option) {
  case 'unordered': case 'unique':
    return option;

  default:
    warn({
      message: 'Passing unsupported option',
      explain: [
        ['The invalid option is', option],
        'PolytonFactory filters its 3rd argument.',
        `Only 'unordered' and 'unique' strings/keys are passed through.`,
        'Valid syntax:' +
          `'unordered' or ['unordered', 'unique'] or {unique: true}.`,
      ],
    });
  }
};

export const reduceOptions = (validOptions, option) => {
  if (typeof option === 'string') {
    const opt = isValidOption(option);

    if (opt !== undefined) {
      validOptions[opt] = true; // eslint-disable-line no-param-reassign
    }
  } else if (typeof option === 'object') {
    Object.keys(option).forEach(key => {
      const opt = isValidOption(key);

      if (opt !== undefined && option[key] === true) {
        validOptions[opt] = true; // eslint-disable-line no-param-reassign
      }
    });
  }

  return validOptions;
};
