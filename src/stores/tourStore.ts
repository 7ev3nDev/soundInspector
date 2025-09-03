import { defineStore } from 'pinia'
import type { Driver, DriveStep } from "driver.js";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { ref } from "vue";

export const useTourStore = defineStore('tour', () => {
    const driverObj: Driver = driver();

    const started = ref<boolean>(false)

    function startTour(steps: DriveStep[]) {
        driverObj.setConfig({
            animate: true,
            showProgress: false,
            onCloseClick: _ => {
                started.value = false;
                driverObj.destroy();
            }
        })
        driverObj.setSteps(steps);
        driverObj.drive();
        started.value = true;
    }

    function continueTour(steps: DriveStep[]) {
        driverObj.destroy()
        driverObj.setSteps(steps);
        driverObj.drive();
    }

    function pauseTour() {
        driverObj.destroy()
    }

    return {
        started,
        driverObj,
        startTour,
        continueTour,
        pauseTour
    }
})