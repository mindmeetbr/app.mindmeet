import Axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import useAuthStore from '../../stores/auth-store';

export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://localhost:8000' });

AXIOS_INSTANCE.interceptors.request.use(config => {
  const authStore = useAuthStore.getState()

  if (authStore.isAuthenticated) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

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