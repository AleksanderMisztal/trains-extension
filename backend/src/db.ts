import { loadObject, saveObject } from './utils.js';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Uid, ObjectWithUid } from './types.js';

if (!fs.existsSync('./db')) fs.mkdirSync('./db');

export class Collection<T> {
  name: string;
  savePath: string;
  data: (T & ObjectWithUid)[];
  constructor(name: string, preprocess: (x: T) => T) {
    this.name = name;
    this.savePath = './db/' + name + '.json';
    if (!fs.existsSync(this.savePath)) saveObject(this.savePath, []);
    const data = loadObject<(T & ObjectWithUid)[]>(this.savePath);
    if (data) this.data = data;
    else this.data = [];
    if (preprocess)
      this.data = this.data.map((item) => {
        const processed = <T & ObjectWithUid>preprocess(item);
        processed.uid = item.uid;
        return processed;
      });
  }

  save() {
    saveObject(this.savePath, this.data);
    console.log(`Saved ${this.name} to a file.`);
  }

  get(uid: Uid) {
    return this.data.find((item) => item.uid.toString() === uid.toString());
  }

  add(object: T): Uid {
    const objectWtithUid = <T & ObjectWithUid>object;
    objectWtithUid.uid = uuid();
    this.data.push(objectWtithUid);
    return objectWtithUid.uid;
  }
}

const collections: Collection<any>[] = [];
export const getCollection = <T>(name: string, preprocess?: (x: T) => T) => {
  const matching = collections.find((c) => c.name === name);
  if (matching) return matching;
  const collection = new Collection<T>(name, preprocess);
  collections.push(collection);
  return collection;
};

setInterval(
  () =>
    collections.forEach((collection) => {
      collection.save();
    }),
  60000
);

[
  //`exit`,
  `SIGINT`,
  //`SIGUSR1`,
  //`SIGUSR2`,
  //`uncaughtException`,
  //`SIGTERM`,
].forEach((eventType) => {
  process.on(eventType, saveCollections);
});

function saveCollections() {
  console.log('Saving collections');
  collections.forEach((collection) => {
    collection.save();
  });
  process.removeListener('exit', saveCollections);
  process.exit();
}
