import http from "k6/http";
import { sleep } from "k6";
import { Counter } from 'k6/metrics';

export const serverErrors = new Counter('server_errors');

export const options = {
  vus: __ENV.VUS ? Number(__ENV.VUS) : 50,    // increased load
  duration: __ENV.DURATION || "30s",          // safe default
};

export default function () {
  const res = http.get(__ENV.TARGET_URL);

  if (res.status >= 500) {
    serverErrors.add(1);
  }

  sleep(1);
}
