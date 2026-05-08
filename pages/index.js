import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getSeat } from "../lib/seats";

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", power: "", contact: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      setSettings(data);
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const assignedSeat = getSeat(form.power, settings);
    const { error } = await supabase.from('submissions').insert([
      { name: form.name, power: form.power, contact: form.contact, seat: assignedSeat, status: 'Pending' }
    ]);
    if (!error) setResult(assignedSeat);
    setLoading(false);
  }

  const t = {
    ar: { title: "بوابة 1771", name: "اسم الحاكم", power: "القوة", contact: "التواصل", btn: "تأكيد", result: "مقعدك هو:" },
    en: { title: "1771 Portal", name: "Governor Name", power: "Power", contact: "Contact", btn: "Confirm", result: "Your Seat:" }
  };

  return (
    <div style={{ backgroundColor: '#0a1020', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px', borderRadius: '10px' }}>{lang === 'ar' ? 'English' : 'عربي'}</button>
      <div style={{ backgroundColor: '#111827', padding: '40px', borderRadius: '24px', border: '1px solid #1e293b', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#3b82f6' }}>{t[lang].title}</h1>
        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <input placeholder={t[lang].name} style={inputStyle} required onChange={e => setForm({...form, name: e.target.value})} />
            <input type="number" placeholder={t[lang].power} style={inputStyle} required onChange={e => setForm({...form, power: e.target.value})} />
            <input placeholder={t[lang].contact} style={inputStyle} required onChange={e => setForm({...form, contact: e.target.value})} />
            <button type="submit" disabled={loading} style={btnStyle}>{loading ? "..." : t[lang].btn}</button>
          </form>
        ) : (
          <div style={{ marginTop: '30px' }}>
            <p>{t[lang].result}</p>
            <h2 style={{ fontSize: '3rem', color: '#fbbf24' }}>{result}</h2>
            <button onClick={() => setResult(null)} style={{ background: 'none', color: '#64748b', border: 'none', cursor: 'pointer' }}>تعديل</button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #1e293b', backgroundColor: '#020617', color: '#fff' };
const btnStyle = { padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
          
