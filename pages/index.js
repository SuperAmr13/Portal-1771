import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getSeat } from "../lib/seats";

// نصوص الترجمة للغتين
const translations = {
  ar: {
    title: "بوابة التسجيل الهجـرة",
    kingdom: "مملكة 1771",
    subtitle: "القادة العظام يحتاجون إلى مقاعد عظمى. سجل بياناتك الآن لضمان مكانك في الصفوف الأولى.",
    labelName: "اسم الحاكم (داخل اللعبة)",
    labelPower: "إجمالي قوة الابطال (Total Hero Power)",
    labelContact: "معرف الديسكورد (Discord ID)",
    placeholderContact: "Name#0000",
    buttonCheck: "تأكيد الانضمام",
    buttonChecking: "جاري التحقق وقص المقعد...",
    resultTitle: "مقعدك الذي يليق بك:",
    buttonEdit: "تعديل البيانات",
    error: "حدث خطأ، حاول مرة أخرى."
  },
  en: {
    title: "Migration Registration",
    kingdom: "Kingdom 1771",
    subtitle: "Great leaders require great seats. Register your stats now to secure your place in the front ranks.",
    labelName: "Governor Name (IGN)",
    labelPower: "Total Power",
    labelContact: "Discord ID",
    placeholderContact: "Name#0000",
    buttonCheck: "Confirm Join",
    buttonChecking: "Checking Stats...",
    resultTitle: "Your Assigned Seat:",
    buttonEdit: "Edit Stats",
    error: "Error occurred, try again."
  }
};

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", power: "", contact: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const t = translations[lang];

  useEffect(() => {
    // جلب أرقام الحدود عند تحميل الصفحة
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      setSettings(data);
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmissionError("");
    const assignedSeat = getSeat(form.power, settings);

    // إرسال البيانات إلى Supabase
    const { error } = await supabase.from('submissions').insert([
      { name: form.name, power: form.power, contact: form.contact, seat: assignedSeat }
    ]);

    if (!error) {
      setResult(assignedSeat);
    } else {
      setSubmissionError(t.error);
    }
    setLoading(false);
  }

  return (
    <div style={styles.container(lang)}>
      {/* زر تبديل اللغة */}
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={styles.langButton(lang)}>
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>

      {/* الكارت الرئيسي للتصميم */}
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.kingdomBadge}>{t.kingdom}</div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} style={styles.form(lang)}>
            {/* حقل الاسم */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.labelName}</label>
              <input 
                style={styles.input} 
                required 
                type="text"
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>

            {/* حقل القوة */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.labelPower}</label>
              <input 
                style={styles.input} 
                required 
                type="number" 
                onChange={e => setForm({...form, power: e.target.value})} 
              />
            </div>

            {/* حقل التواصل */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.labelContact}</label>
              <input 
                style={styles.input} 
                required 
                type="text"
                placeholder={t.placeholderContact}
                onChange={e => setForm({...form, contact: e.target.value})} 
              />
            </div>

            {/* زر الإرسال */}
            <button type="submit" disabled={loading} style={styles.submitButton(loading)}>
              {loading ? t.buttonChecking : t.buttonCheck}
            </button>
            {submissionError && <p style={styles.errorMessage}>{submissionError}</p>}
          </form>
        ) : (
          {/* صفحة عرض النتيجة */}
          <div style={styles.resultContainer}>
            <p style={styles.resultLabel}>{t.resultTitle}</p>
            <div style={styles.seatBadge(result)}>
              <span style={styles.seatText}>{result}</span>
              <div style={styles.seatGlow(result)} />
            </div>
            <button onClick={() => setResult(null)} style={styles.editButton}>
              {t.buttonEdit}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === استايلات التصميم (styles) ===
const styles = {
  container: (lang) => ({
    // خلفية أزرق ليلي عميق جداً بدلاً من الأسود
    backgroundColor: '#0a1020',
    backgroundImage: `
      radial-gradient(at 10% 10%, rgba(60, 130, 246, 0.15) 0px, transparent 50%),
      radial-gradient(at 90% 90%, rgba(168, 85, 247, 0.15) 0px, transparent 50%)
    `,
    color: '#e2e8f0',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    direction: lang === 'ar' ? 'rtl' : 'ltr',
  }),
  langButton: (lang) => ({
    position: 'absolute',
    top: '20px',
    [lang === 'ar' ? 'left' : 'right']: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(5px)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
    }
  }),
  card: {
    // تأثير الزجاج المقوى والنيومورفيزم
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    backdropFilter: 'blur(16px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: `
      10px 10px 20px rgba(0, 0, 0, 0.3),
      -5px -5px 15px rgba(255, 255, 255, 0.02),
      inset 0 0 1px 1px rgba(255, 255, 255, 0.05)
    `,
    width: '100%',
    maxWidth: '520px',
    padding: '50px 40px',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  kingdomBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    marginBottom: '15px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 0 10px 0',
    color: '#fff',
    letterSpacing: '-1px',
    backgroundImage: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: '0',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  form: (lang) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    textAlign: lang === 'ar' ? 'right' : 'left',
  }),
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    color: '#cbd5e1',
    fontWeight: '600',
    padding[lang === 'ar' ? 'right' : 'left']: '5px',
  },
  input: {
    backgroundColor: '#111827',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '16px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)',
    ':focus': {
      border: '1px solid #3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15), inset 2px 2px 5px rgba(0,0,0,0.2)',
    },
  },
  submitButton: (loading) => ({
    backgroundColor: '#3b82f6',
    backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    padding: '18px',
    borderRadius: '18px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: loading ? 0.7 : 1,
    marginTop: '15px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(37, 99, 235, 0.4)',
    },
  }),
  resultContainer: {
    textAlign: 'center',
    padding: '30px 0',
  },
  resultLabel: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    marginBottom: '20px',
  },
  seatBadge: (seat) => {
    // تحديد لون النيون بناءً على الفئة
    let color = '#fff'; // White
    if (seat === 'Gold') color = '#fbbf24'; // ذهبي نيون
    if (seat === 'Purple') color = '#a855f7'; // بنفسجي نيون
    if (seat === 'Blue') color = '#3b82f6'; // أزرق نيون

    return {
      display: 'inline-block',
      position: 'relative',
      padding: '20px 50px',
      borderRadius: '24px',
      backgroundColor: '#111827',
      border: `2px solid ${color}`,
      marginBottom: '40px',
      boxShadow: `
        inset 0 0 15px rgba(0, 0, 0, 0.5),
        0 0 20px ${color}40
      `, // توهج خارجي ناعم
    }
  },
  seatText: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: '#fff', // النص نفسه أبيض ليكون مقروءاً
    letterSpacing: '1px',
    position: 'relative',
    zIndex: 2,
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  seatGlow: (seat) => {
    let color = '#fff';
    if (seat === 'Gold') color = '#fbbf24';
    if (seat === 'Purple') color = '#a855f7';
    if (seat === 'Blue') color = '#3b82f6';

    return {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      borderRadius: '22px',
      background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
      zIndex: 1,
    }
  },
  editButton: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }
  },
  errorMessage: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '0.9rem',
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
