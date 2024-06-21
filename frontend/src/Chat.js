import { useCallback, useEffect, useState } from "react";

export const Chat = ({ socket, channel }) => {
  const [state, setState] = useState(false);
  const [receive, setReceive] = useState(false);
  const [send, setSend] = useState("");

  useEffect(() => {
    const disconnect = () => {
      setState(false);
    };

    const download = (arg) => {
      if (channel === arg.channel) setReceive(arg);
    };

    const joinComplete = (arg) => {
      if (channel === arg.channel) setState(true);
    };

    socket.on("disconnect", disconnect);
    socket.on("download_msg", download);
    socket.on("join_complete", joinComplete);
    return () => {
      socket.off("disconnect", disconnect);
      socket.off("download_msg", download);
      socket.off("join_complete", joinComplete);
      socket.disconnect();
    };
  }, [socket, channel]);

  const onSend = useCallback(() => {
    if (!state) return;
    socket.emit("upload_msg", { msg: send, channel });
  }, [socket, state, send, channel]);

  const join = useCallback(() => {
    socket.emit("join", { channel });
  }, [socket, channel]);

  const leave = useCallback(() => {
    socket.emit("leave", { channel });
    setState(false);
  }, [socket, channel]);

  return (
    <div>
      <strong>Channel {channel}</strong>
      <p>{receive && `${receive.sender}: ${receive.message}`}</p>
      <div>
        <button onClick={join}>Join</button>
        <button onClick={leave}>Leave</button>
      </div>
      <div>
        <input
          value={send}
          onChange={(e) => setSend(e.target.value)}
          disabled={!state}
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};
