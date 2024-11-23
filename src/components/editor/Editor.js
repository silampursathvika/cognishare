import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { html } from '@codemirror/lang-html';
import { cpp } from '@codemirror/lang-cpp'; // C++ language
import { go } from '@codemirror/lang-go'; // Go language
import { php } from '@codemirror/lang-php'; // PHP language
import { rust } from '@codemirror/lang-rust'; // Rust language
import { oneDark } from '@codemirror/theme-one-dark'; // New theme import
import io from "socket.io-client";

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

    socket.on("code-update", (updatedCode) => {
      setCode(updatedCode);
    });

    socket.on("input-update", (updatedInput) => {
      setInput(updatedInput);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

//   // Update input state when textarea changes
//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

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
          version: "*", // Use the latest version
          files: [{ name: `main.${language.toLowerCase()}`, content: code }],
          stdin: input,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      // Check for output or errors
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Multi-Language Code Editor</h2>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.keys(languageExtensions).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <CodeMirror
        value={code}
        height="300px"
        extensions={[languageExtensions[language]()]}
        theme={oneDark} // Apply the new theme
        onChange={(value) => handleCodeChange(value)}
      />

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="input">Input: </label>
        <textarea
          id="input"
          value={input}
          onChange={handleInputChange}
          rows="4"
          style={{ width: '100%', marginBottom: '10px' }}
        ></textarea>
        <button onClick={runCode} style={{ padding: '10px 20px' }}>Run</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Output:</h3>
        <pre style={{ background: '#f4f4f4', padding: '10px' }}>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
