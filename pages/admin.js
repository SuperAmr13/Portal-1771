import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [subs, setSubs] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) fetchData();
    });
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (data) setSubs(data);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("خطأ في الدخول");
    else window.location.reload();
  };

  const updateStatus = async (id, status) => {
    await supabase.from('submissions').update({ status }).eq('id', id);
    fetchData();
  };

  if (!user) return (
    <div style={{ backgroundColor: '#0a1020', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ color: '#fff' }}>Admin Login</h2>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#0a1020', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Admin Panel</h1>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())}>Logout</button>
      </div>
      <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#1e293b' }}>
          <tr>
            <th>Name</th><th>Power</th><th>Seat</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #1e293b', textAlign: 'center' }}>
              <td>{s.name}</td>
              <td>{(s.power/1000000).toFixed(1)}M</td>
              <td>{s.seat}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => updateStatus(s.id, 'Accepted')} style={{ color: '#10b981', marginRight: '10px' }}>Accept</button>
                <button onClick={() => updateStatus(s.id, 'Rejected')} style={{ color: '#ef4444' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#020617', color: '#fff' };
const btnStyle = { padding: '10px', backgroundColor: '#3b82f6', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' };
