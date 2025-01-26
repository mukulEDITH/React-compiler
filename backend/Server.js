const express = require("express");
const bodyParser = require("body-parser");
const babel = require("@babel/core");
const cors = require("cors");
const React = require("react");
const { renderToString } = require("react-dom/server");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/compile", (req, res) => {
  const { code } = req.body;

  try {
    console.log("Received code:", code);

    // Transpile the React code (JSX -> JS)
    const result = babel.transformSync(code, {
      presets: ["@babel/preset-react"],
    });

    console.log("Transpiled code:", result.code);

    // Capture console logs
    let logs = "";
    const originalLog = console.log;
    console.log = (log) => {
      logs += log + "\n";
    };

    let renderedHTML = "";
try {
  // Create a function from the transpiled code
  const createComponent = new Function("React", result.code + "; return App;");
  const Component = createComponent(React);

  // Check if the Component is a valid React element
  if (!React.isValidElement(React.createElement(Component))) {
    throw new Error("You must render a valid React element, like <App />.");
  }

  // Render the React element to HTML
  renderedHTML = renderToString(React.createElement(Component));
} catch (executionError) {
  console.log = originalLog; // Restore console.log
  console.error("Execution Error:", executionError.message);
  return res.status(500).json({
    error: "Error in executing the code",
    details: executionError.message,
  });
}


    console.log = originalLog; // Restore console.log

    // Send the response
    return res.json({
      logs,
      renderedHTML,
    });
  } catch (compilationError) {
    console.error("Compilation Error:", compilationError.message);
    return res.status(500).json({ error: "Error in compiling the code", details: compilationError.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
