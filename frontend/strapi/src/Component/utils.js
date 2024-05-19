// utils.js
export const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-IN', options);
  };
  