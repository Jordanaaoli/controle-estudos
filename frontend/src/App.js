import { useEffect, useState } from 'react';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [duration, setDuration] = useState('');

  async function loadSubjects() {
    const response = await fetch('http://localhost:3000/subjects');
    const data = await response.json();
    setSubjects(data);
  }

  async function loadSessions() {
    const response = await fetch('http://localhost:3000/sessions');
    const data = await response.json();
    setSessions(data);
  }

  useEffect(() => {
    loadSubjects();
    loadSessions();
  }, []);

  async function handleCreateSubject(e) {
    e.preventDefault();

    await fetch('http://localhost:3000/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: subjectName }),
    });

    setSubjectName('');
    loadSubjects();
  }

  async function handleCreateSession(e) {
    e.preventDefault();

    await fetch('http://localhost:3000/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject_id: Number(selectedSubject),
        duration: Number(duration),
      }),
    });

    setSelectedSubject('');
    setDuration('');
    loadSessions();
  }

  return (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fb',
      padding: '32px 16px',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>
        Controle de Estudos
      </h1>

      <h2>Cadastrar matéria</h2>
      <form
        onSubmit={handleCreateSubject}
        style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}
      >
        <input
          type="text"
          placeholder="Nome da matéria"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Salvar
        </button>
      </form>

      <h2>Matérias</h2>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        {subjects.map((subject) => (
          <li key={subject.id} style={{ marginBottom: '6px' }}>
            {subject.name}
          </li>
        ))}
      </ul>

      <h2>Registrar sessão de estudo</h2>
      <form
        onSubmit={handleCreateSession}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">Selecione uma matéria</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Duração em minutos"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            width: '180px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Registrar
        </button>
      </form>

      <h2>Sessões registradas</h2>
      <ul style={{ paddingLeft: '20px' }}>
        {sessions.map((session) => (
          <li key={session.id} style={{ marginBottom: '6px' }}>
            {session.subject_name} — {session.duration} minutos
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

export default App;