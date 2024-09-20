import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(18);
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket Error", e);
        toast.error("Socket connection Failed, try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for JOINED Event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId(e) {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Copied Room ID`);
    } catch (e) {
      toast.error("Could not copy the Room ID");
      console.error(e);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  if (theme === "dark") {
    document.documentElement.style.setProperty("--background-color", "#1c1e29");
    document.documentElement.style.setProperty("--text-color", "#fff");
    document.documentElement.style.setProperty(
      "--input-output-color",
      "#282a36"
    );
    document.documentElement.style.setProperty("--border-color", "whitesmoke");
    document.documentElement.style.setProperty("--logo-color", "#1c1e29");
  } else {
    document.documentElement.style.setProperty("--background-color", "#f8f8f8");
    document.documentElement.style.setProperty("--text-color", "#000");
    document.documentElement.style.setProperty("--input-output-color", "#fff");
    document.documentElement.style.setProperty("--border-color", "grey");
    document.documentElement.style.setProperty("--logo-color", "#484a4f");
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client username={client.username} key={client.socketId} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Navbar
          theme={theme}
          handleThemeChange={handleThemeChange}
          language={language}
          handleLanguageChange={handleLanguageChange}
          fontSize={fontSize}
          handleFontSizeChange={handleFontSizeChange}
        />
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          fontSize={fontSize}
          theme={theme}
          language={language}
        />
      </div>
      <div className="InputOutput">
        <div className="input">
          <div className="inputHead">
            <h2>Input</h2>
          </div>
          <div className="inputText">
            <textarea></textarea>
          </div>
        </div>
        <div className="output">
          <div className="outputHead">
            <h2>Output</h2>
          </div>
          <div className="outputText">
            <textarea></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
