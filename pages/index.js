import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getSeat } from "../lib/seats";

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", power: "", contact: "" });
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    }
    getSettings();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const assignedSeat = getSeat(form.power, settings);
    
    // حفظ البيانات في Supabase
    const { error } = await supabase.from('submissions').insert([
      { name: form.name, power: form.power, contact: form.contact, seat: assignedSeat }
    ]);

    if (!error) {
      setSeat(assignedSeat);
    } else {
      alert("حدث خطأ أثناء التسجيل");
    }
    setLoading(false);
  }

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
