import store from "@/store";
import { isAccountLoggedIn } from "./auth";

import dayjs from "dayjs";

import { refreshCookie } from "@/api/auth";
import { dailySignin } from "@/api/user";

// 歌曲是否能够播放
export function isTrackPlayable(track) {
  let result = {
    playable: true,
    reason: "",
  };
  if (track?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result;
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isAccountLoggedIn() && store.state.data.user.vipType === 11) {
      result.playable = true;
    } else {
      result.playable = false;
      result.reason = "VIP Only";
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = "付费专辑";
  } else if (
    track.noCopyrightcmd !== null &&
    track.noCopyrightcmd !== undefined
  ) {
    result.playable = false;
    result.reason = "无版权";
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false;
    result.reason = "已下架";
  }
  return result;
}

export function mapTrackPlayableStatus(tracks, privileges = []) {
  if (tracks.length === undefined) return tracks;
  return tracks.map((t) => {
    const privilege = privileges.find((item) => item.id === t.id) || {};
    if (t.privilege) {
      Object.assign(t.privilege, privilege);
    } else {
      t.privilege = privilege;
    }
    let result = isTrackPlayable(t);
    t.playable = result.playable;
    t.reason = result.reason;
    return t;
  });
}

// 改变主题背景 -- 深色 / 浅色
export function changeAppearance(appearance) {
  if (appearance === "auto" || appearance === undefined) {
    appearance = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  document.body.setAttribute("data-theme", appearance);
  document
    .querySelector('meta[name="theme-color"]')
    // .setAttribute("content", appearance === "dark" ? "#222" : "#fff");
}

export function dailyTask() {
  let lastDate = store.state.data.lastRefreshCookieDate;
  if (
    isAccountLoggedIn() &&
    (lastDate === undefined || lastDate !== dayjs().date())
  ) {
    console.debug("[debug][common.js] exexute dailyTask");
    refreshCookie().then(() => {
      console.debug("[debug][common.js] 刷新cookie");
      store.commit("updateData", {
        key: "lastRefreshCookieDate",
        value: dayjs().date(),
      });
    });
    dailySignin(0).catch(() => {
      console.debug("[debug][common.js] 手机端重复签到");
    });
    dailySignin(1).catch(() => {
      console.debug("[debug][common.js] PC端重复签到");
    });
  }
}
