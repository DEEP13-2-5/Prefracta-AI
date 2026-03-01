const API_URL = (import.meta.env.VITE_API_URL || "https://syncmind-ai.onrender.com/api").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

type RequestConfig = {
    timeoutMs?: number;
    maxRetries?: number;
};

const getHeaders = (token?: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseResponse = async (res: Response) => {
    const text = await res.text();
    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        if (!res.ok) {
            throw new Error(text || `Request failed with status ${res.status}`);
        }
        throw new Error("Invalid server response. Please try again.");
    }
};

const request = async (
    path: string,
    options: RequestInit = {},
    config: RequestConfig = {},
    attempt = 0,
): Promise<any> => {
    const timeoutMs = config.timeoutMs ?? REQUEST_TIMEOUT_MS;
    const maxRetries = config.maxRetries ?? MAX_RETRIES;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${API_URL}${path}`, {
            ...options,
            signal: controller.signal,
        });

        const body = await parseResponse(res);

        if (!res.ok) {
            const message = body?.error || body?.message || `Request failed with status ${res.status}`;

            if (res.status >= 500 && attempt < maxRetries) {
                await wait(500 * (attempt + 1));
                return request(path, options, config, attempt + 1);
            }

            return { error: message };
        }

        return body;
    } catch (error: any) {
        const isAbort = error?.name === "AbortError";
        const isNetworkFailure = isAbort || error instanceof TypeError;

        if (isNetworkFailure && attempt < maxRetries) {
            await wait(500 * (attempt + 1));
            return request(path, options, config, attempt + 1);
        }

        return {
            error: isAbort
                ? "Request timed out. Please try again."
                : (error?.message || "Network error. Please try again."),
        };
    } finally {
        clearTimeout(timeoutId);
    }
};

export const api = {
    // Auth
    signup: async (username: string, email: string, password: string) => {
        return request('/auth/signup', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, email, password })
        }, {
            timeoutMs: 12000,
            maxRetries: 0,
        });
    },

    login: async (email: string, password: string) => {
        return request('/auth/login', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        }, {
            timeoutMs: 12000,
            maxRetries: 0,
        });
    },

    // Load Test
    runLoadTest: async (token: string, testURL: string, githubRepo?: string) => {
        return request('/load-test', {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ testURL, githubRepo })
        });
    },

    // Chat
    sendMessage: async (token: string, sessionId: string, message: string) => {
        return request('/chat', {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ sessionId, message })
        });
    },

    getChatHistory: async (token: string, sessionId: string | number) => {
        return request(`/chat/${sessionId}`, {
            headers: getHeaders(token)
        });
    },

    // Payment
    createSubscription: async (token: string, planType: 'weekly' | 'monthly') => {
        return request('/payment/create-sub', {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ planType })
        });
    },

    verifyPayment: async (token: string, paymentData: any) => {
        return request('/payment/verify-payment', {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(paymentData)
        });
    },

    getLoadTest: async (token: string, id: string | number) => {
        return request(`/load-test/${id}`, {
            headers: getHeaders(token)
        });
    },

    getLatestLoadTest: async (token: string) => {
        return request('/load-test/latest', {
            headers: getHeaders(token)
        });
    }
};
