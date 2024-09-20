import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  fontSize,
  theme,
  language,
}) => {
  const editorRef = useRef(null);

  function getCodeMirrorMode(language) {
    switch (language) {
      case "java":
        return "text/x-java";
      case "cpp":
        return "text/x-c++src";
      case "c":
        return "text/x-csrc";
      case "python":
        return "text/x-python";
      case "javascript":
        return { name: "javascript", json: true };
      default:
        return "text";
    }
  }

  useEffect(() => {
    async function init() {
      const mode = getCodeMirrorMode(language);
      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: mode,
          theme: `${theme === "dark" ? "dracula" : "eclipse"}`,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);
  useEffect(() => {
    if (editorRef.current) {
      const mode = getCodeMirrorMode(language);
      editorRef.current.setOption("mode", { name: mode });
    }
    //  if (socketRef.current) {
    //    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, language });
    //  }
  }, [language]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getWrapperElement().style.fontSize = `${fontSize}px`;
      editorRef.current.setOption(
        "theme",
        theme === "dark" ? "dracula" : "eclipse"
      );
    }
  }, [fontSize, theme]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
