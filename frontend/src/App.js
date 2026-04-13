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
    <div style={{
  padding: '32px',
  fontFamily: 'Arial',
  maxWidth: '600px',
  margin: '0 auto'
}}>
      <h1>Controle de Estudos</h1>

      <h2>Cadastrar matéria</h2>
      <form onSubmit={handleCreateSubject}>
        <input
          style={{ marginRight: '8px', padding: '8px' }}
          type="text"
          placeholder="Nome da matéria"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        
        <button 
        type="submit" 
        style={{ padding: '8px 12px', cursor: 'pointer' }}
>
          Salvar matéria
        </button>
      </form>

      <h2>Matérias</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {subject.id} - {subject.name}
          </li>
        ))}
      </ul>

      <h2>Registrar sessão de estudo</h2>
      <form onSubmit={handleCreateSession}>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
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
        />

        <button 
        type="submit" 
        style={{ padding: '8px 12px', cursor: 'pointer' }}
>
          Salvar sessão
        </button>
      </form>

      <h2>Sessões registradas</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            {session.subject_name} - {session.duration} minutos
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;