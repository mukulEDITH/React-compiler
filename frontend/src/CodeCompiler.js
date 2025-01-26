import React, { useState } from "react";
import axios from "axios";

const CodeCompiler = () => {
  const [code, setCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [renderedOutput, setRenderedOutput] = useState("");
  const [error, setError] = useState("");

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleCompile = async () => {
    try {
      setError("");
      setConsoleOutput("");
      setRenderedOutput("");

      const response = await axios.post("http://localhost:5000/compile", { code });

      if (response.data.error) {
        setError(response.data.error + ": " + response.data.details);
      } else {
        const { logs, renderedHTML } = response.data;
        setConsoleOutput(logs);
        setRenderedOutput(renderedHTML);
      }
    } catch (err) {
      console.error("Request Error:", err.message);
      setError("Failed to compile the code. Please check the backend.");
    }
  };

  return (
    <div>
      <h1>React Code Compiler</h1>
      <textarea
        rows="10"
        cols="50"
        value={code}
        onChange={handleCodeChange}
        placeholder="Write your React code here"
      />
      <br />
      <button onClick={handleCompile}>Compile Code</button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <h3>Console Output:</h3>
      <pre class="consolecomp"
      
      placeholder="Your console output will come here">{consoleOutput}</pre>

      <h3>Rendered Output:</h3>
      <div class="reactcomp" dangerouslySetInnerHTML={{ __html: renderedOutput }} 
      
      placeholder="Your react output will come here"/>
    </div>
  );
};

export default CodeCompiler;
