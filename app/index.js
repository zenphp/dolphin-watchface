import clock from "clock";
import * as document from "document";
import {battery} from "power";
import {today} from "user-activity";
import {days, monthsShort} from "./lib/locales/en";
import {display} from "display";

const clockLabel = document.getElementById("clock-label");
const dateLabel = document.getElementById("date-label");
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let minHandShadow = document.getElementById("mins-shadow");
let secHand = document.getElementById("secs");

let txtPower = document.getElementById('txtPower');
let txtSteps = document.getElementById('txtSteps');


// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
    let hourAngle = (360 / 12) * hours;
    let minAngle = (360 / 12 / 60) * minutes;
    return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
    return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
    return (360 / 60) * seconds;
}


// Tick every second
clock.granularity = display.on ? "seconds" : "minutes";

// Rotate the hands every tick
function updateClock(event) {
    let todayDate = event.date;
    let hours24 = todayDate.getHours();
    let hours = hours24 % 12;
    let mins = todayDate.getMinutes();
    let secs = todayDate.getSeconds();

    hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
    minHand.groupTransform.rotate.angle = minutesToAngle(mins);
    minHandShadow.groupTransform.rotate.angle = minutesToAngle(mins);
    secHand.groupTransform.rotate.angle = secondsToAngle(secs);

    clockLabel.text = String("00" + hours24).slice(-2)
        + ":"
        + String("00" + mins).slice(-2)
        + ":"
        + String("00" + secs).slice(-2);

    dateLabel.text = days[todayDate.getDay()]  + " " + monthsShort[todayDate.getMonth()] + " " + todayDate.getDate() + ", " + todayDate.getFullYear();
    txtPower.text = Math.floor(battery.chargeLevel) + "%";

    let stepCount = (today.adjusted.steps || 0);
    txtSteps.text = stepCount > 999 ? Math.floor(stepCount / 1000) + "," + ("00" + (stepCount % 1000)).slice(-3) : stepCount;
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);

display.addEventListener("change", () => {
    if (display.on) {
        clock.granularity = "seconds";
    } else {
        clock.granularity = "minutes";
    }
});
