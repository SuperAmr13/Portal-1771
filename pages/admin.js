import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [settings, setSettings] = useState({ gold_limit: 80000000, purple_limit: 60000000, blue_limit: 40000000 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: subs } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    const { data: sett } = await supabase.from('settings').select('*').single();
    if (subs) setSubmissions(subs);
    if (sett) setSettings(sett);
  }

  async function updateSettings() {
    await supabase.from('settings').update(settings).eq('id', 1);
    alert("تم التحديث بنجاح!");
  }

  return (
    <div style={{ padding: 40, background: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>لوحة التحكم 1771</h1>
      
      <div style={{ border: '1px solid #333', padding: 20, marginBottom: 20 }}>
        <h3>تعديل حدود القوة (Power)</h3>
        Gold: <input type="number" value={settings.gold_limit} onChange={e => setSettings({...settings, gold_limit: e.target.value})} />
        Purple: <input type="number" value={settings.purple_limit} onChange={e => setSettings({...settings, purple_limit: e.target.value})} />
        Blue: <input type="number" value={settings.blue_limit} onChange={e => setSettings({...settings, blue_limit: e.target.value})} />
        <button onClick={updateSettings}>حفظ التعديلات</button>
      </div>

      <h3>قائمة المسجلين</h3>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
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
