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
    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
      setLoading(false);
    };
    checkUser();

    // مراقبة تغيير حالة الدخول (تسجيل دخول أو خروج)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function fetchInitialData() {
    const { data: s1 } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    const { data:
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
