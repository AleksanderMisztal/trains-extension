export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

import fs from 'fs';

export const loadObject = <T>(fileName: string): T => {
  if (!fs.existsSync(fileName)) return null;
  const rawdata = fs.readFileSync(fileName).toString();
  return JSON.parse(rawdata);
};
export const saveObject = (fileName: string, object: object) => {
  const data = JSON.stringify(object);
  fs.writeFileSync(fileName, data);
};

export const randomCode = (length: number) =>
  Array.from({ length })
    .map((_) => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join('');
