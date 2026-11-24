import { useState } from 'react';

// Reusable component: displays one student's information.
function StudentRow({ student }) {
  return (
    <tr>
      <td>{student.rollNo}</td>
      <td className="student-name">{student.name}</td>
      <td>{student.percentage.toFixed(1)}%</td>
      <td>{student.totalMarks} / {student.maxMarks}</td>
      <td><span className={`grade grade-${student.grade.replace('+', 'plus')}`}>{student.grade}</span></td>
    </tr>
  );
}

// Reusable component: renders the complete student table.
function StudentTable({ students }) {
  if (students.length === 0) {
    return <div className="empty-state">No students added yet. Use the form to add the first student.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Percentage</th>
            <th>Total Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentRow key={student.rollNo} student={student} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

const initialStudents = [
  { rollNo: '101', name: 'Rahul Sharma', percentage: 92, totalMarks: 460, maxMarks: 500, grade: 'A+' },
  { rollNo: '102', name: 'Priya Reddy', percentage: 85, totalMarks: 425, maxMarks: 500, grade: 'A' },
  { rollNo: '103', name: 'Arun Kumar', percentage: 76, totalMarks: 380, maxMarks: 500, grade: 'B' },
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [form, setForm] = useState({ rollNo: '', name: '', totalMarks: '', maxMarks: '500' });
  const [message, setMessage] = useState('');

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage('');
  };

  const addStudent = (event) => {
    event.preventDefault();
    const total = Number(form.totalMarks);
    const maximum = Number(form.maxMarks);

    if (students.some((student) => student.rollNo === form.rollNo.trim())) {
      setMessage('That roll number already exists.');
      return;
    }
    if (!form.rollNo.trim() || !form.name.trim() || !Number.isFinite(total) ||
        !Number.isFinite(maximum) || maximum <= 0 || total < 0 || total > maximum) {
      setMessage('Please enter valid details. Marks must be between 0 and maximum marks.');
      return;
    }

    const percentage = (total / maximum) * 100;
    const newStudent = {
      rollNo: form.rollNo.trim(),
      name: form.name.trim(),
      totalMarks: total,
      maxMarks: maximum,
      percentage,
      grade: getGrade(percentage),
    };

    setStudents([...students, newStudent]);
    setForm({ rollNo: '', name: '', totalMarks: '', maxMarks: '500' });
    setMessage('Student added successfully.');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-mark">SMS</div>
          <div>
            <h1>Student Management System</h1>
            <p>Simple and organized academic records</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="welcome">
          <div>
            <p className="eyebrow">STUDENT DASHBOARD</p>
            <h2>Student Records</h2>
            <p className="subheading">View student performance and add new records.</p>
          </div>
          <div className="student-count"><strong>{students.length}</strong><span>Total Students</span></div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h3>Add a Student</h3>
              <p>Enter the student's details below.</p>
            </div>
          </div>
          <form className="student-form" onSubmit={addStudent}>
            <label>
              Roll Number
              <input name="rollNo" value={form.rollNo} onChange={updateField} placeholder="e.g. 104" required />
            </label>
            <label>
              Student Name
              <input name="name" value={form.name} onChange={updateField} placeholder="Enter full name" required />
            </label>
            <label>
              Total Marks Obtained
              <input name="totalMarks" type="number" min="0" value={form.totalMarks} onChange={updateField} placeholder="e.g. 420" required />
            </label>
            <label>
              Maximum Marks
              <input name="maxMarks" type="number" min="1" value={form.maxMarks} onChange={updateField} required />
            </label>
            <button type="submit">+ Add Student</button>
          </form>
          {message && <p className="form-message" role="status">{message}</p>}
        </section>

        <section className="panel records-panel">
          <div className="section-heading">
            <div>
              <h3>All Students</h3>
              <p>Percentage and grade are calculated automatically.</p>
            </div>
            <span className="records-label">{students.length} records</span>
          </div>
          <StudentTable students={students} />
        </section>

        <p className="grade-note"><strong>Grade scale:</strong> A+ 90–100 · A 80–89 · B 70–79 · C 60–69 · D 50–59 · F below 50</p>
      </main>

      <footer className="site-footer">
        <p>© 2026 Student Management System</p>
        <p>Built with React.js · Component Rendering</p>
      </footer>
    </div>
  );
}
