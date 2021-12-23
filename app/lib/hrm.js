import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { me } from "appbit";
import { user } from "user-profile";

let hrm, watchID, hrmCallback;
let lastReading = 0;
let heartRate;

export function init(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();
    setupEvents();
    start();
    lastReading = hrm.timestamp;
  }
  else {
    console.log("Denied Heart Rate or User Profile permission");
  }
}

function getReading() {
  if (hrm.timestamp === lastReading) {
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
    let zone =  user.heartRateZone( heartRate || 0 );
    hrmCallback({
      bpm: heartRate,
      zone: zone,
      restingHeartRate: user.restingHeartRate
    });
  }
  lastReading = hrm.timestamp;
}

function setupEvents() {
  display.addEventListener("change", function() {
    if (display.on) {
      start();
    }
    else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
