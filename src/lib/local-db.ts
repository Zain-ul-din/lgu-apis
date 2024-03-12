import {existsSync, mkdirSync, writeFileSync} from "fs";
import env from "./env";
import {encrypt, hashStr} from "./cipher";

const DB_PATH = process.cwd() + "/db";
const LOCAL_DB_PATH = process.cwd() + "/local_db";

if (env.NODE_ENV === "development") initLocalDB();

export function writeDB(uid: string, content: any, hash: boolean = true) {
  console.log(`🔃 Going to write '${uid}'`);
  writeDBLocal(uid, content);
  writeDBPublic(uid, content, hash);
  console.log(`✔ Operation succeed '${uid}'`);
}

function writeDBLocal(uid: string, content: any) {
  if (env.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

function writeDBPublic(uid: string, content: any, hash: boolean = true) {
  const crypted = encrypt(JSON.stringify(content));
  writeFileSync(
    `${DB_PATH}/${hash ? hashStr(uid) : uid}.json`,
    JSON.stringify(
      {
        updated_at: new Date(),
        crypted,
      },
      null,
      2
    ),
    "utf-8"
  );
}

function initLocalDB() {
  if (!existsSync(LOCAL_DB_PATH)) mkdirSync(LOCAL_DB_PATH);
}