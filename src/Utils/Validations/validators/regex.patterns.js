export const phoneRegEx = new RegExp(/^01(0|1|2|5)\d{8}$/);

export const userNameRegEx = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z]?)(?=.*[0-9]?)(?=[@_]{0,2})(?!.*!#$%&*()-+=\/\\\."';:|,<>\{\}\[\]).{3,16}$/
);

export const passwordRegEx = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z]?)(?=.*[0-9]?)(?!.*!#$%&*()-+=\/\\\."';:|,<>\{\}\[\]).{3,16}$/
);

export const emailRegEx = new RegExp(
  /^\w+@(gmail|yahoo|outlook)(\.com|\.net|\.edu|\.org){1,3}$/
);
