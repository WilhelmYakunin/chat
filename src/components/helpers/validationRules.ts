export const namePattern = /(^[A-Z]{1}[a-z\\-]$)|(^[А-Я]{1}[а-я\\-]$)/;
export const loginPattern = /[A-Za-z0-9_\\-]{3,20}$/;
export const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/;
export const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
export const phonePattern =
  /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im;
export const messagePattern = /(.|\s)*\S(.|\s)*/;
