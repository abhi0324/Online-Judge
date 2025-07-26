import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Editor from '@monaco-editor/react';
import '../styles/problemdetail.css';
import ReactMarkdown from 'react-markdown';

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;
  
int main()
{

    return 0;
}`);
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [message, setMessage] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get(`/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblem(res.data);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Problem not found');
      }
    };
    fetchProblem();
  }, [id]);

  const codeTemplates = {
    cpp: `#include<bits/stdc++.h>
using namespace std;

int main()
{
    return 0;
}`,
    python: `def main():
    pass

if __name__ == "__main__":
    main()`,
    java: `public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`
  };

  const handleRun = async () => {
    setLoadingRun(true);
    setOutput('');
    setMessage('');
    try {
      const res = await API.post('/run', { code, language, input });
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.output || 'Error running code');
    } finally {
      setLoadingRun(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(
        '/submissions',
        { code, language, problemId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleReview = async () => {
    setLoadingReview(true);
    try {
      const res = await API.post('/gemini-review', { code });
      setReview(res.data.response);
    } catch (err) {
      setReview(err.response?.data?.output || 'Error while reviewing code');
    } finally {
      setLoadingReview(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(codeTemplates[selectedLang]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!problem) return <p className="loading-text">{message || 'Loading...'}</p>;

  return (
    <div className="problem-details">
      <h2>{problem.title}</h2>
      <p>
        <span className={`diff-tag ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </p>
      <p>{problem.description}</p>
      <p><strong>Input Format:</strong> {problem.inputFormat}</p>
      <p><strong>Output Format:</strong> {problem.outputFormat}</p>
      <p><strong>Constraints: </strong> <pre>{problem.constraints}</pre></p>
      <p>
        <strong>Examples:</strong>{' '} <br />
        <ul>
          {problem.examples.map((test, idx) => (
            <li key={idx} className="example-block">
              <div className="example-header">
                <p><strong>Input: </strong></p>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(test.input)}>
                  📋 Copy
                </button>
              </div>
              <pre>{test.input}</pre>

              <div className="example-header">
                <p><strong>Output: </strong></p>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(test.output)}>
                  📋 Copy
                </button>
              </div>
              <pre>{test.output}</pre>
            </li>
          ))}
        </ul>
      </p>

      <div style={{ marginTop: '2rem' }}>
        <label><strong>Language:</strong></label>{' '}
        <select value={language} onChange={handleLanguageChange}>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="300px"
        language={language === 'cpp' ? 'cpp' : language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />

      <textarea
        rows="3"
        className="input-box"
        placeholder="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="button-group">
        <button onClick={handleRun} disabled={loadingRun}>
          {loadingRun ? '⏳ Running...' : '▶️ Run Code'}
        </button>
        <button onClick={handleSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? '⏳ Submitting...' : '📤 Submit Code'}
        </button>
        <button onClick={handleReview} disabled={loadingReview}>
          {loadingReview ? '⏳ Reviewing...' : '🤖 AI Review'}
        </button>
      </div>

      {output && (
        <div className="output-box">
          <h3>✅ Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {message && (
        <div className={`feedback ${message.includes('Accepted') ? 'accepted' : 'wrong'}`}>
          <h3>📢 Verdict:</h3>
          <p>{message}</p>
        </div>
      )}

      {loadingReview ? (
        <div className="ai-review-loading">
          <div className="loading-shimmer"></div>
          <p>🤖 AI is analyzing your code...</p>
        </div>
      ) : review && (
        <div className="review-box">
          <div className="review-header">
            <h3>🤖 AI Review</h3>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(review)}>
              📋 Copy
            </button>
          </div>
          <div className="review-content">
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDetails;
