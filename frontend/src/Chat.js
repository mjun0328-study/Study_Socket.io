import { useCallback, useEffect, useState } from "react";
import { socketAddress } from "./socket";
import io from "socket.io-client";

export const Chat = ({ channel }) => {
  const socket = io(socketAddress);

  const [state, setState] = useState(false);
  const [receive, setReceive] = useState("");
  const [send, setSend] = useState("");

  useEffect(() => {
    const connect = async () => {
      socket.emit("join", { channel });
    };

    const disconnect = () => {
      setState(false);
    };

    const download = (arg) => {
      setReceive(arg.message);
    };

    const joined = () => {
      setState(true);
    };

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("download_msg", download);
    socket.on("join_complete", joined);
    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("download_msg", download);
      socket.off("join_complete", joined);
      socket.disconnect();
    };
  }, [socket, channel]);

  const onSend = useCallback(() => {
    if (!state) return;
    socket.emit("upload_msg", { msg: send, channel });
  }, [socket, state, send, channel]);

  return (
    <div>
      <strong>Channel {channel}</strong>
      <p>Receive: {receive}</p>
      <div>
        <input value={send} onChange={(e) => setSend(e.target.value)} />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};
