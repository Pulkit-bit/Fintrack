import axios from 'axios';
import { auth } from '../auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const http = axios.create({
baseURL: 'http://localhost:8080',
headers: { 'Content-Type': 'application/json' },
});

// Wait for first auth state so we have a user/token at startup
let authReady;
function ensureAuthReady() {
if (!authReady) {
authReady = new Promise((resolve) => {
try {
const unsub = onAuthStateChanged(auth, () => {
unsub();
resolve();
});
// Fallback so we don't hang forever if listener never fires
setTimeout(resolve, 2000);
} catch {
resolve();
}
});
}
return authReady;
}

// Attach token before each request
http.interceptors.request.use(
async (config) => {
try {
await ensureAuthReady();
const user = auth.currentUser;
if (user) {
// getIdToken returns cached token or refreshes if needed
const token = await user.getIdToken().catch(() => null);
if (token) {
config.headers = {
...(config.headers || {}),
Authorization: 'Bearer ' + token,
};
}
} else if (config.headers && 'Authorization' in config.headers) {
delete config.headers.Authorization;
}
} catch {
// swallow
}
return config;
},
(error) => Promise.reject(error)
);

// Response interceptor: on 401, force-refresh and retry once
let isRefreshing = false;
let pending = [];

function subscribePending(cb) {
pending.push(cb);
}
function notifyPending(token) {
pending.forEach((cb) => cb(token));
pending = [];
}

http.interceptors.response.use(
(res) => res,
async (error) => {
const status = error?.response?.status;
const original = error?.config;
if (status === 401 && original && !original._retry) {
original._retry = true;


  // Only one refresh at a time
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await ensureAuthReady();
      const user = auth.currentUser;
      // Force refresh
      const newToken = user ? await user.getIdToken(true) : null;
      notifyPending(newToken);
      isRefreshing = false;

      if (newToken) {
        original.headers = {
          ...(original.headers || {}),
          Authorization: 'Bearer ' + newToken,
        };
        return http(original);
      }
    } catch (e) {
      isRefreshing = false;
      notifyPending(null);
    }
  }

  // Queue callers while refresh is in flight
  return new Promise((resolve, reject) => {
    subscribePending((newToken) => {
      if (newToken) {
        original.headers = {
          ...(original.headers || {}),
          Authorization: 'Bearer ' + newToken,
        };
        http(original).then(resolve).catch(reject);
      } else {
        reject(error);
      }
    });
  });
}
return Promise.reject(error);
}
);

export default http;
