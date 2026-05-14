import Axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import useAuthStore from '../../stores/auth-store';
import axios from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://localhost:8000' });

interface ApiError {
  code: string
  detail: string
  messages: unknown[]
}

interface RefreshResponse {
  access: string
  refresh: string
  access_expiration: string
  refresh_expiration: string
}

AXIOS_INSTANCE.interceptors.request.use(config => {
  const authStore = useAuthStore.getState()

  if (authStore.isAuthenticated) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

let isRefreshing = false;
let failedRequestQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedRequestQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequestQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  // requisicao bem sucedida
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as any
    const { logout, refreshToken, setAccessToken, setRefreshToken } = useAuthStore.getState()
    const errorData = error.response?.data as ApiError

    const isTokenError = errorData.code === "token_not_valid"

    if (error.response?.status === 401 && isTokenError) {
      // requisição sendo feita no momento -> adicionar essa na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return AXIOS_INSTANCE(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios.post<RefreshResponse>('http://localhost:8000/api/auth/token/refresh', {
          refresh: refreshToken
        }).
          then((response) => {
            const { data } = response
            const newAccessToken = data.access
            const newRefreshToken = data.refresh
            setAccessToken(newAccessToken)
            setRefreshToken(newRefreshToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(AXIOS_INSTANCE(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null)
            logout()
            reject(err)
          })
          .finally(() => {
            isRefreshing = false;
          })
      })
    }

    return Promise.reject(error)
  }
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

// // Or, in case you want to wrap the body type (optional)
// // (if the custom instance is processing data before sending it, like changing the case for example)
// export type BodyType<BodyData> = CamelCase<BodyData>;