import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import io from "socket.io-client";
import Chat from "../chat/Chat.js";
import "./Editor.css"; // Importing the CSS

const languageExtensions = {
  JavaScript: javascript,
  Python: python,
  Java: java,
  HTML: html,
  Cpp: cpp,
  Go: go,
  PHP: php,
  Rust: rust,
};

const Editor = () => {
  const { roomId, name } = useParams();
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    socket.emit("join-room", roomId);
    console.log("Joining room", roomId);

    socket.on("code-update", (updatedCode) => {
      setCode(updatedCode);
    });

    socket.on("input-update", (updatedInput) => {
      setInput(updatedInput);
    });

    socket.on("language-update", (updatedLanguage) => {
      setLanguage(updatedLanguage);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const runCode = async () => {
    setOutput("Running...");

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language.toLowerCase(),
          version: "*",
          files: [{ name: `main.${language.toLowerCase()}`, content: code }],
          stdin: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.run && result.run.output) {
        setOutput(result.run.output);
      } else if (result.run && result.run.stderr) {
        setOutput(`Error: ${result.run.stderr}`);
      } else {
        setOutput("Unexpected API response");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit("code-change", roomId, value);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket) {
      socket.emit("input-change", roomId, e.target.value);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    if (socket) {
      socket.emit("language-change", roomId, selectedLanguage);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-main">
        <h2>Multi-Language Code Editor</h2>

        <div>
          <label className="label" htmlFor="language">
            Select Language:
          </label>
          <select
            id="language"
            className="select"
            value={language}
            onChange={handleLanguageChange}
          >
            {Object.keys(languageExtensions).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="code-editor">
          <CodeMirror
            value={code}
            height="300px"
            extensions={[languageExtensions[language]()]}
            theme={oneDark}
            onChange={(value) => handleCodeChange(value)}
          />
        </div>

        <div className="run-button-container">
          <button onClick={runCode}>Run</button>
        </div>

        <div className="terminals">
          <div className="terminal">
            <label className="label">Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Enter input for your program..."
            ></textarea>
          </div>

          <div className="terminal">
            <label className="label">Output</label>
            <pre>{output}</pre>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className="editor-chat">
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default Editor;
