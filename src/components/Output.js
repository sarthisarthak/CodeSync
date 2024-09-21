import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../Actions";

const Output = ({ socketRef, roomId, inputRef, codeRef, language }) => {
  const [output, setOutput] = useState("");
  const outputRef = useRef(output);
  const compileCode = () => {
    // setLoading(true);
    // if (socketRef.current) {
    //   socketRef.current.emit(ACTIONS.LOADING_CHANGE, { roomId });
    // }
    if (codeRef.current === "") return;
    Axios.post(`${process.env.REACT_APP_BACKEND_URL}/compile`, {
      code: codeRef.current,
      language,
      input: inputRef.current,
    })
      .then((res) => {
        outputRef.current = res.data.stdout || res.data.stderr;
        setOutput(res.data.stdout || res.data.stderr);
        // setLoading(false);
      })
      .catch((err) => {
        outputRef.current =
          "Error: " + err.response ? err.response.data.error : err.message;
        setOutput(
          "Error: " + err.response ? err.response.data.error : err.message
        );
        // setLoading(false);
      });
  };
  const clearConsole = () => {
    outputRef.current = "";
    setOutput("");
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, {
        roomId,
        output,
      });
    }
  }, [outputRef.current]);
  useEffect(() => {
    if (socketRef.current) {
      // socketRef.current.on(ACTIONS.LOADING_CHANGE, () => {
      //   setLoading(true);
      // });
      socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
        setOutput(output);
        // setLoading(false);
        outputRef.current = output;
      });
    }
  }, [socketRef.current]);
  return (
    <div className="output">
      <div className="outputHead">
        <h2>Output</h2>
      </div>
      <div className="outputText">
        <textarea value={outputRef.current} readOnly></textarea>
        <button onClick={clearConsole} className="clearBtn btn">
          Clear
        </button>
        <button onClick={compileCode} className="runBtn btn">
          Run
        </button>
      </div>
    </div>
  );
};

export default Output;
