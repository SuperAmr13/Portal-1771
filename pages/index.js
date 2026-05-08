import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getSeat } from "../lib/seats";

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", power: "", contact: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = {
    ar: {
      title: "بوابة مملكة 1771",
      subtitle: "قدم الآن للحصول على مقعدك في المملكة",
      name: "اسم الحاكم",
      power: "إجمالي القوة",
      contact: "وسيلة التواصل (ديسكورد/واتساب)",
      button: "تحقق من مقعدي",
      processing: "جاري المعالجة...",
      resultTitle: "مقعدك المخصص هو:",
      applyAgain: "تقديم مرة أخرى",
    },
    en: {
      title: "1771 KINGDOM PORTAL",
      subtitle: "Apply now for your seat in the kingdom",
      name: "Hero Name",
      power: "Total Power",
      contact: "Contact Info (Discord/WA)",
      button: "CHECK MY SEAT",
      processing: "Processing...",
      resultTitle: "Your Assigned Seat:",
      applyAgain: "Apply Again",
    }
  };

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
    const { error } = await supabase.from('submissions').insert([{ ...form, seat: assignedSeat }]);
    if (!error) setResult(assignedSeat);
    setLoading(false);
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ position: 'absolute', top: '20px', right: lang === 'ar' ? 'auto' : '20px', left: lang === 'ar' ? '20px' : 'auto', background: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>

      <div style={{ backgroundColor: '#161616', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: '100%', maxWidth: '450px', border: '1px solid #333' }}>
        <h1 style={{ textAlign: 'center', color: '#ffcc00', marginBottom: '10px', fontSize: '1.8rem' }}>{t[lang].title}</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>{t[lang].subtitle}</p>
        
        {!result ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>{t[lang].name}</label>
              <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2

  return (
    <div style={{ background: "#121212", color: "#fff", minHeight: "100vh", padding: 20, textAlign: 'center' }}>
      <h1>{lang === 'ar' ? 'بوابة 1771' : '1771 Portal'}</h1>
      <form onSubmit={submit} style={{ maxWidth: 400, margin: 'auto' }}>
        <input style={{width:'100%', padding:10, margin:'5px 0'}} placeholder="Name" required onChange={e => setForm({ ...form, name: e.target.value })} />
        <input style={{width:'100%', padding:10, margin:'5px 0'}} type="number" placeholder="Hero Power" required onChange={e => setForm({ ...form, power: e.target.value })} />
        <input style={{width:'100%', padding:10, margin:'5px 0'}} placeholder="Contact (Discord/WA)" required onChange={e => setForm({ ...form, contact: e.target.value })} />
        <button type="submit" disabled={loading} style={{padding:10, width:'100%', background:'#007bff', color:'#fff', border:'none'}}>
          {loading ? '...' : (lang === 'ar' ? 'تقديم' : 'Apply')}
        </button>
      </form>
      {seat && <h2 style={{marginTop:20}}>Your Seat: <span style={{color: seat.toLowerCase()}}>{seat}</span></h2>}
    </div>
  );
  }
