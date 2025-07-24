import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    difficulty: "Easy",
    examples: [{ input: "", output: "" }],
    testCases: [{ input: "", output: "" }],
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProblems = async () => {
    try {
      const res = await API.get("/problems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems", err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...form.examples];
    updated[index][field] = value;
    setForm({ ...form, examples: updated });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const addExample = () => {
    setForm({
      ...form,
      examples: [...form.examples, { input: "", output: "" }],
    });
  };

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [...form.testCases, { input: "", output: "" }],
    });
  };

  const removeExample = (index) => {
    const updated = form.examples.filter((_, i) => i !== index);
    setForm({ ...form, examples: updated });
  };

  const removeTestCase = (index) => {
    const updated = form.testCases.filter((_, i) => i !== index);
    setForm({ ...form, testCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/problems/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/problems", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        constraints: "",
        difficulty: "Easy",
        examples: [{ input: "", output: "" }],
        testCases: [{ input: "", output: "" }],
      });
      setEditId(null);
      fetchProblems();
    } catch (err) {
      console.error("Error saving problem", err);
    }
  };

  const handleEdit = async (problem) => {
    try {
      const res = await API.get(`/problems/${problem._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullProblem = res.data;

      setForm({
        title: fullProblem.title || "",
        description: fullProblem.description || "",
        inputFormat: fullProblem.inputFormat || "",
        outputFormat: fullProblem.outputFormat || "",
        constraints: fullProblem.constraints || "",
        difficulty: fullProblem.difficulty || "Easy",
        examples: fullProblem.examples && fullProblem.examples.length > 0 ? fullProblem.examples : [{ input: "", output: "" }],
        testCases: fullProblem.testCases && fullProblem.testCases.length > 0 ? fullProblem.testCases : [{ input: "", output: "" }],
      });
      setEditId(problem._id);
    } catch (err) {
      console.error("Error fetching full problem for edit", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      await API.delete(`/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProblems();
    } catch (err) {
      console.error("Error deleting problem", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - Manage Problems</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="inputFormat"
          placeholder="Input Format"
          value={form.inputFormat}
          onChange={handleChange}
        />
        <input
          name="outputFormat"
          placeholder="Output Format"
          value={form.outputFormat}
          onChange={handleChange}
        />
        <input
          name="constraints"
          placeholder="Constraints"
          value={form.constraints}
          onChange={handleChange}
        />
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Examples */}
        <h4>Examples</h4>
        {form.examples.map((ex, index) => (
          <div key={index} className="example-row">
            <input
              placeholder="Example Input"
              value={ex.input}
              onChange={(e) =>
                handleExampleChange(index, "input", e.target.value)
              }
            />
            <input
              placeholder="Example Output"
              value={ex.output}
              onChange={(e) =>
                handleExampleChange(index, "output", e.target.value)
              }
            />
            <button type="button" onClick={() => removeExample(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addExample}>
          + Add Example
        </button>

        {/* Hidden Test Cases */}
        <h4>Hidden Test Cases</h4>
        {form.testCases.map((tc, index) => (
          <div key={index} className="testcase-row">
            <input
              placeholder="Test Input"
              value={tc.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
            />
            <input
              placeholder="Expected Output"
              value={tc.output}
              onChange={(e) =>
                handleTestCaseChange(index, "output", e.target.value)
              }
            />
            <button type="button" onClick={() => removeTestCase(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addTestCase}>
          + Add Test Case
        </button>

        <button type="submit">
          {editId ? "Update Problem" : "Add Problem"}
        </button>
      </form>

      <h3>Existing Problems</h3>
      <ul className="problem-list">
        {problems.map((p) => (
          <li key={p._id}>
            <span>
              {p.title} - {p.difficulty}
            </span>
            <span>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
