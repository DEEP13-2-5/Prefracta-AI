import http from "k6/http";
import { sleep } from "k6";
import { Counter } from 'k6/metrics';

export const serverErrors = new Counter('server_errors');

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 50,
  duration: __ENV.DURATION || "30s",
};

export default function () {
  const res = http.get(__ENV.TARGET_URL);

  if (res.status >= 500) {
    serverErrors.add(1);
  }

  const sleepDuration = __ENV.SLEEP_DURATION ? Number(__ENV.SLEEP_DURATION) : 0.05;
  if (sleepDuration > 0) {
    sleep(sleepDuration);
  }
}
