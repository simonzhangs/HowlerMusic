// import axios from "axios";
import Dexie from "dexie";
import { result } from "lodash";
// import store from "@/store";

const db = new Dexie("yesplaymusic");

db.version(4).stores({
  trackDetail: "&id, updateTime",
  lyric: "&id, updateTime",
  album: "&id, updateTime",
});

db.version(3)
  .stores({
    trackSources: "&id, createTime",
  })
  .upgrade((tx) =>
    tx
      .table("trackSources")
      .toCollection()
      .modify(
        (track) =>
          !track.createTime && (track.createTime = new Date().getTime())
      )
  );

db.version(1).stores({
  trackSources: "&id",
});

// let tracksCacheBytes = 0;

export function cacheTrackDetail(track, privileges) {
  db.trackDetail.put({
    id: track.id,
    detail: track,
    privileges: privileges,
    updateTime: new Date().getTime(),
  });
}

export function getTrackDetailFromCache(ids) {
  return db.trackDetail
    .filtet((track) => {
      return ids.includes(String(track.id));
    })
    .toArray()
    .then((tracks) => {
      const result = { songs: [], privileges: [] };
      ids.map((id) => {
        const one = tracks.find((t) => String(t.id) === id);
        result.songs.push(one?.detail);
        result.privileges.push(one?.privileges);
      });
      if (result.songs.includes(undefined)) {
        return undefined;
      }
      return result;
    });
}

export function cacheLyric(id, lyrics) {
    db.lyric.put({
        id,
        lyrics,
        updateTime: new Date().getTime(),
    });
}

export function getLyricFromCache(id) {
    return db.lyric.get(Number(id)).then(result => {
        if (!result) return undefined;
        return result.lyrics;
    });
}

export function cacheAlbum(id, album) {
  db.album.put({
    id: Number(id),
    album,
    updateTime: new Date().getTime(),
  });
}

export function getAlbumFromCache(id) {
  return db.album.get(Number(id)).then(result => {
    if (!result) return undefined;
    return result.album;
  })
}