const REGEX = {
  IS_EMAIL: /\S+@\S+\.\S{2,}/,
};

export const isEmail = (email) => REGEX.IS_EMAIL.test(email);
