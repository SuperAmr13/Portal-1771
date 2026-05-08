import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subs, setSubs] = useState([]);
  const [sets, setSets] = useState({ gold_limit: 0, purple_limit: 0, blue_limit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
      setLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function fetchInitialData() {
    const { data: s1 } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    const { data: s2 } = await supabase.from('settings').select('*').single();
    if (s1) setSubs(s1);
    if (s2) setSets(s2);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("بيانات الدخول غير صحيحة");
  };

  const handleStatusUpdate = async (id, status) => {
    const { error } = await supabase.from('submissions').update({ status: status }).eq('id', id);
    if (!error) {
      setSubs(subs.map(s => s.id === id ? { ...s, status: status } : s));
    }
  };

  const handleUpdateLimits = async () => {
    await supabase.from('settings').update(sets).eq('id', 1);
    alert("تم التحديث!");
  };

  if (loading) return <div style={styles.loading}>جاري التحميل...</div>;

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Admin Access</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input type="email" placeholder="Email" style={styles.input} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" style={styles.input} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" style={styles.primaryButton}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminPage}>
      <div style={styles.header}>
        <h1 style={styles.title}>Kingdom 1771 | Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* لوحة التحكم في حدود القوة */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>تعديل متطلبات المقاعد</h3>
        <div style={styles.limitsGrid}>
          <div style={styles.inputGroup}>
            <label style={{color: '#fbbf24'}}>Gold Limit</label>
            <input type="number" value={sets.gold_limit} style={styles.inputSmall} onChange={e=>setSets({...sets, gold_limit: e.target.value})} />
          </div>
          <div style={styles.inputGroup}>
            <label style={{color: '#a855f7'}}>Purple Limit</label>
            <input type="number" value={sets.purple_limit} style={styles.inputSmall} onChange={e=>setSets({...sets, purple_limit: e.target.value})} />
          </div>
          <div style={styles.inputGroup}>
            <label style={{color: '#3b82f6'}}>Blue Limit</label>
            <input type="number" value={sets.blue_limit} style={styles.inputSmall} onChange={e=>setSets({...sets, blue_limit: e.target.value})} />
          </div>
          <button onClick={handleUpdateLimits} style={styles.saveBtn}>تحديث الإعدادات</button>
        </div>
      </div>

      {/* جدول اللاعبين */}
      <div style={styles.table
            <th>الاسم</th>
            <th>القوة</th>
            <th>المقعد</th>
            <th>التواصل</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.power}</td>
              <td>{s.seat}</td>
              <td>{s.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
