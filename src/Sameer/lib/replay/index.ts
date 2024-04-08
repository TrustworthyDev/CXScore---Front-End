import { Api } from "@/api";
import { useCallback, useState } from "react";

const checkReplayStatus = async ({ channel }: { channel: string }) => {
  const response = await Api.get<
    unknown,
    {
      connected: boolean;
    }
  >("/ws-status", {
    params: {
      channel,
    },
  });

  if (!response) {
    return false;
  }

  return !!response.connected;
};

const doReplay = ({
  channel,
  eventSequence,
}: {
  channel: string;
  eventSequence: string[];
}) => {
  return Api.post("/wsmsg", {
    channel,
    msg: {
      type: "replay",
      eventSequence,
    },
  });
};

export const useReplay = () => {
  const [isLoading, setLoading] = useState(false);

  const replay = useCallback(
    async (eventSequence: string[]) => {
      if (isLoading) {
        alert("Please wait. Replay is in progress.");
        return;
      }

      try {
        setLoading(true);
        const channel = "test";

        const isConnected = await checkReplayStatus({ channel });

        if (!isConnected) {
          alert("Replay Failed (Agent is not connected)");
          return;
        }

        const { data: replayResult } = await doReplay({
          channel,
          eventSequence,
        });
      } catch (e) {
        console.log("Replay Failed", e);
        alert("Replay Failed (Something went wrong)");
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    replay,
    isLoading,
  };
};
