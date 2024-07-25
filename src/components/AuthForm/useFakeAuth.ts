import { useCallback, useMemo, useState } from "react";

const DEFAULT_RESPONSE_CONFIG: FakeResponseConfig = {
  type: "error",
  message: "Email or password is incorrect",
  timeout: 1000,
};

type FakeResponse =
  | {
      type: "success";
    }
  | {
      type: "error";
      message: string;
    };

type FakeResponseConfig = FakeResponse & {
  timeout?: number;
};

export function useFakeResponseConfig() {
  const [config, setConfig] = useState<FakeResponseConfig | null>(null);

  return useMemo(
    () => ({
      config: config,
      setConfig: setConfig,
    }),
    [config, setConfig],
  );
}

export function useFakeAuth() {
  const { config: nextResponseConfig } = useFakeResponseConfig();
  return useCallback(
    async (_email: string, _password: string): Promise<FakeResponse> =>
      new Promise((resolve) => {
        const { timeout = 1000, ...response } =
          nextResponseConfig ?? DEFAULT_RESPONSE_CONFIG;

        setTimeout(() => {
          resolve(response);
        }, timeout);
      }),
    [nextResponseConfig],
  );
}
