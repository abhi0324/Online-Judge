import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import Editor from '@monaco-editor/react';
import '../styles/problemdetail.css';
import ReactMarkdown from 'react-markdown';

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    // Your code here
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
  const [showReview, setShowReview] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // 3-Tier AI Hints state
  const [hints, setHints] = useState({});
  const [loadingHint, setLoadingHint] = useState(null);
  const [showHintsSection, setShowHintsSection] = useState(false);
  const [activeHintTab, setActiveHintTab] = useState(1);

  // AI Cooldown timers
  const [aiReviewCooldown, setAiReviewCooldown] = useState(0);
  const [hintCooldown, setHintCooldown] = useState(0);

  const codeTemplates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    python: `def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()`,
    java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await API.get(`/problems/${id}`, { headers });
        setProblem(res.data);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Problem not found');
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please Sign In to run code and test custom inputs.');
      return;
    }
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
    e?.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please Sign In to submit solutions and record your score.');
      return;
    }
    setMessage('');
    setLoadingSubmit(true);
    try {
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
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please Sign In to use Gemini AI code reviews.');
      return;
    }
    if (aiReviewCooldown > 0) return;

    setLoadingReview(true);
    setReview('');
    
    // Start 10-second cooldown
    setAiReviewCooldown(10);
    const timer = setInterval(() => {
      setAiReviewCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const res = await API.post(
        '/gemini-review',
        {
          code,
          language,
          problemTitle: problem?.title || '',
          problemDescription: problem?.description || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReview(res.data.response);
      setShowReview(true);
    } catch (err) {
      setReview(err.response?.data?.error || err.response?.data?.output || 'Error while reviewing code');
      setShowReview(true);
    } finally {
      setLoadingReview(false);
    }
  };

  const fetchHint = async (level) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please Sign In to request AI hints.');
      return;
    }
    setActiveHintTab(level);
    if (hints[level]) {
      return;
    }
    if (hintCooldown > 0) return;

    // Start 5-second cooldown
    setHintCooldown(5);
    const timer = setInterval(() => {
      setHintCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      setLoadingHint(level);
      const res = await API.post(
        '/gemini-review/hint',
        {
          problemTitle: problem?.title || '',
          problemDescription: problem?.description || '',
          hintLevel: level,
          currentCode: code,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHints((prev) => ({ ...prev, [level]: res.data.hint }));
    } catch (err) {
      setHints((prev) => ({ ...prev, [level]: err.response?.data?.error || 'Failed to generate hint. Please try again.' }));
    } finally {
      setLoadingHint(null);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(codeTemplates[selectedLang]);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to default template?')) {
      setCode(codeTemplates[language]);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!problem) {
    return (
      <div className="problem-loading-wrap">
        <div className="spinner"></div>
        <p>{message || 'Loading problem workspace...'}</p>
      </div>
    );
  }

  const isAccepted = message.toLowerCase().includes('accepted');
  const isVerdict = Boolean(message);

  return (
    <div className="workspace-container">
      {/* Top Breadcrumb Bar */}
      <div className="workspace-header">
        <div className="breadcrumb">
          <Link to="/problems" className="back-link">
            <i className="fas fa-chevron-left"></i> Problems
          </Link>
          <span className="divider">/</span>
          <span className="current-title">{problem.title}</span>
        </div>
        <span className={`diff-pill diff-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="workspace-grid">
        {/* Left Panel: Problem Description */}
        <div className="problem-panel">
          <div className="problem-description-card">
            <h1 className="problem-main-title">{problem.title}</h1>
            
            <div className="meta-tags">
              <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
              <span className="meta-chip"><i className="fas fa-memory"></i> 256 MB</span>
              <span className="meta-chip"><i className="fas fa-stopwatch"></i> 2.0s</span>
            </div>

            <div className="section-block">
              <h3>Description</h3>
              <p className="description-text">{problem.description}</p>
            </div>

            {problem.inputFormat && (
              <div className="section-block">
                <h3>Input Format</h3>
                <div className="format-box">{problem.inputFormat}</div>
              </div>
            )}

            {problem.outputFormat && (
              <div className="section-block">
                <h3>Output Format</h3>
                <div className="format-box">{problem.outputFormat}</div>
              </div>
            )}

            {problem.constraints && (
              <div className="section-block">
                <h3>Constraints</h3>
                <pre className="code-block constraints-block">{problem.constraints}</pre>
              </div>
            )}

            {problem.examples && problem.examples.length > 0 && (
              <div className="section-block">
                <h3>Examples</h3>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="example-item">
                    <div className="example-title">Example {idx + 1}</div>
                    
                    <div className="example-box">
                      <div className="example-sub-header">
                        <span>Input:</span>
                        <button 
                          className="copy-mini-btn" 
                          onClick={() => copyToClipboard(ex.input, `in-${idx}`)}
                        >
                          {copiedIndex === `in-${idx}` ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <pre className="example-code">{ex.input}</pre>

                      <div className="example-sub-header">
                        <span>Output:</span>
                        <button 
                          className="copy-mini-btn" 
                          onClick={() => copyToClipboard(ex.output, `out-${idx}`)}
                        >
                          {copiedIndex === `out-${idx}` ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <pre className="example-code">{ex.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3-Tier AI Hint System */}
            <div className="hints-section">
              <div className="hints-header-bar">
                <div className="hints-title-group">
                  <span className="hints-icon"><i className="fas fa-lightbulb"></i></span>
                  <div>
                    <h4 className="hints-heading">AI Progressive Hints</h4>
                    <p className="hints-desc">Get hints without spoiling the whole solution.</p>
                  </div>
                </div>
                
                {!showHintsSection ? (
                  <button 
                    className="open-hints-btn"
                    onClick={() => {
                      setShowHintsSection(true);
                      if (!hints[1]) fetchHint(1);
                    }}
                  >
                    <i className="fas fa-magic"></i> Need a Hint?
                  </button>
                ) : (
                  <button 
                    className="collapse-hints-btn"
                    onClick={() => setShowHintsSection(false)}
                  >
                    Hide Hints <i className="fas fa-chevron-up"></i>
                  </button>
                )}
              </div>

              {showHintsSection && (
                <div className="hints-body">
                  {/* Hint Level Tabs */}
                  <div className="hint-tabs">
                    {[
                      { level: 1, label: 'Hint 1: Intuition' },
                      { level: 2, label: 'Hint 2: Approach' },
                      { level: 3, label: 'Hint 3: Pseudocode' },
                    ].map((h) => (
                      <button
                        key={h.level}
                        className={`hint-tab-btn ${activeHintTab === h.level ? 'active' : ''} ${hints[h.level] ? 'unlocked' : ''}`}
                        onClick={() => fetchHint(h.level)}
                      >
                        <span>{h.label}</span>
                        {hints[h.level] && <i className="fas fa-check hint-check"></i>}
                      </button>
                    ))}
                  </div>

                  {/* Hint Content Box */}
                  <div className="hint-content-box">
                    {loadingHint === activeHintTab ? (
                      <div className="hint-loading">
                        <span className="mini-spinner"></span>
                        <span>Gemini is generating Hint {activeHintTab}...</span>
                      </div>
                    ) : hints[activeHintTab] ? (
                      <div className="hint-markdown markdown-body">
                        <ReactMarkdown>{hints[activeHintTab]}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="hint-unlock-prompt">
                        <p>Click below to generate and unlock Hint {activeHintTab}.</p>
                        <button 
                          className="unlock-hint-btn"
                          onClick={() => fetchHint(activeHintTab)}
                          disabled={hintCooldown > 0 || loadingHint === activeHintTab}
                        >
                          {hintCooldown > 0 ? (
                            <><i className="fas fa-hourglass-half"></i> Wait {hintCooldown}s</>
                          ) : (
                            <><i className="fas fa-key"></i> Unlock Hint {activeHintTab}</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor, Execution & AI Review */}
        <div className="editor-panel">
          {/* Editor Header Toolbar */}
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <label htmlFor="language-select" className="lang-label">
                <i className="fas fa-code"></i>
              </label>
              <select 
                id="language-select"
                value={language} 
                onChange={handleLanguageChange}
                className="language-select"
              >
                <option value="cpp">C++ (GCC)</option>
                <option value="python">Python 3</option>
                <option value="java">Java (OpenJDK)</option>
              </select>
            </div>

            <div className="toolbar-right">
              <button 
                onClick={handleResetCode} 
                className="tool-btn" 
                title="Reset code template"
              >
                <i className="fas fa-undo"></i> Reset
              </button>
              <button 
                onClick={() => copyToClipboard(code, 'code')} 
                className="tool-btn"
                title="Copy code"
              >
                {copiedIndex === 'code' ? '✓ Copied' : <><i className="fas fa-copy"></i> Copy</>}
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="monaco-wrapper">
            <Editor
              height="380px"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Custom Testcase Input */}
          <div className="console-input-section">
            <div className="section-label">
              <span>Custom Input</span>
            </div>
            <textarea
              rows="3"
              className="custom-input-box"
              placeholder="Enter custom input for Run Code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {!localStorage.getItem('token') && (
            <div className="guest-login-banner">
              <div className="guest-banner-left">
                <i className="fas fa-lock"></i>
                <span>Sign in to execute code, submit solutions, and get Gemini AI reviews.</span>
              </div>
              <Link to="/login" className="guest-login-btn">
                Sign In <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          )}

          {/* Action Button Controls */}
          <div className="editor-actions">
            <div className="left-actions">
              <button 
                onClick={handleReview} 
                disabled={loadingReview || aiReviewCooldown > 0} 
                className="btn-ai"
              >
                {loadingReview ? (
                  <><span className="mini-spinner"></span> Analyzing...</>
                ) : aiReviewCooldown > 0 ? (
                  <><i className="fas fa-hourglass-half"></i> Wait {aiReviewCooldown}s</>
                ) : (
                  <><i className="fas fa-brain"></i> AI Review</>
                )}
              </button>
            </div>

            <div className="right-actions">
              <button 
                onClick={handleRun} 
                disabled={loadingRun} 
                className="btn-run"
              >
                {loadingRun ? (
                  <><span className="mini-spinner"></span> Running...</>
                ) : (
                  <><i className="fas fa-play"></i> Run Code</>
                )}
              </button>

              <button 
                onClick={handleSubmit} 
                disabled={loadingSubmit} 
                className="btn-submit"
              >
                {loadingSubmit ? (
                  <><span className="mini-spinner"></span> Submitting...</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Submit</>
                )}
              </button>
            </div>
          </div>

          {/* Execution Output Console */}
          {output && (
            <div className="console-box output-console">
              <div className="console-header">
                <span><i className="fas fa-terminal"></i> Standard Output</span>
              </div>
              <pre className="console-content">{output}</pre>
            </div>
          )}

          {/* Verdict Banner */}
          {isVerdict && (
            <div className={`verdict-banner ${isAccepted ? 'verdict-accepted' : 'verdict-wrong'}`}>
              <div className="verdict-icon">
                <i className={isAccepted ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
              </div>
              <div className="verdict-body">
                <h4>{isAccepted ? 'Accepted (AC)' : 'Verdict Response'}</h4>
                <p>{message}</p>
              </div>
            </div>
          )}

          {/* Gemini AI Review Panel */}
          {loadingReview && (
            <div className="ai-loading-card">
              <div className="ai-pulse-icon"><i className="fas fa-robot"></i></div>
              <div className="ai-loading-text">
                <div className="shimmer-bar short"></div>
                <div className="shimmer-bar long"></div>
                <p>Gemini AI is reviewing code complexity and optimization tips...</p>
              </div>
            </div>
          )}

          {review && !loadingReview && showReview && (
            <div className="ai-review-card">
              <div className="ai-card-header">
                <div className="ai-title">
                  <span className="ai-badge"><i className="fas fa-brain"></i> Gemini AI Review</span>
                </div>
                <div className="ai-card-actions">
                  <button 
                    className="copy-mini-btn"
                    onClick={() => copyToClipboard(review, 'review')}
                  >
                    {copiedIndex === 'review' ? '✓ Copied' : '📋 Copy Review'}
                  </button>
                  <button 
                    className="close-review-btn"
                    onClick={() => setShowReview(false)}
                    title="Dismiss Review"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="ai-card-body markdown-body">
                <ReactMarkdown>{review}</ReactMarkdown>
              </div>
            </div>
          )}

          {review && !loadingReview && !showReview && (
            <div className="show-review-banner">
              <span><i className="fas fa-brain"></i> AI Review is ready</span>
              <button onClick={() => setShowReview(true)} className="view-review-btn">
                Open AI Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
