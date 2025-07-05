import React, { useState } from 'react';
import API from '../api';
import Editor from '@monaco-editor/react'; // import Monaco Editor
import '../styles/onlinecompiler.css';

function OnlineCompiler() {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setError('');

    try {
      const res = await API.post('/run', { code, language, input });
      setOutput(res.data.output);
    } catch (err) {
      setError(err.response?.data?.output || 'Error running code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compiler-container">
      <h2>🧠 Online Compiler</h2>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: '1rem' }}
      >
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      {/* Monaco Code Editor */}
      <Editor
        height="300px"
        language={language === 'cpp' ? 'cpp' : language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />

      <textarea
        className="input-box"
        rows="5"
        placeholder="// Optional input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleRun} disabled={loading}>
        {loading ? '⏳ Running...' : '▶️ Run Code'}
      </button>

      {output && (
        <div className="output-box">
          <h3>✅ Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {error && (
        <div className="error-box">
          <h3>❌ Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default OnlineCompiler;
