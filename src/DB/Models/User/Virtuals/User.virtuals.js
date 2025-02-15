// Full Name Virtual :
export const fullName_virtual = function () {
  return this.firstName && this.lastName
    ? `${this.firstName} ${this.lastName}`
    : this.firstName;
};

// Age Virtual :
export const age_virtual = function (value) {
  const nowDate = new Date().getFullYear();
  const userDate = new Date(value).getFullYear();
  const age = nowDate - userDate;
  return this.set({ age });
};
