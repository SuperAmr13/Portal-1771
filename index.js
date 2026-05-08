import { useState } from "react";
import { getSeat } from "../lib/seats";

export default function Home() {
  const [lang, setLang] = useState("en");

  const t = {
    en: {
      title: "1771 Portal",
      apply: "Apply",
      solo: "Solo Registration",
      group: "Group Registration",
      contact: "Contact"
    },
    ar: {
      title: "بوابة 1771",
      apply: "تقديم",
      solo: "تسجيل فردي",
      group: "تسجيل جروب",
      contact: "وسيلة التواصل"
    }
  };

  const [form, setForm] = useState({ name:"", power:"", contact:"" });
  const [seat, setSeat] = useState("");

  function submit(e){
    e.preventDefault();
    setSeat(getSeat(form.power));
  }

  return (
    <div style={{background:"#000",color:"#fff",minHeight:"100vh",padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <h1>{t[lang].title}</h1>
        <button onClick={()=>setLang(lang==="en"?"ar":"en")}>🌐</button>
      </div>

      <h2>{t[lang].solo}</h2>

      <form onSubmit={submit}>
        <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Hero Power" onChange={e=>setForm({...form,power:e.target.value})}/>
        <input placeholder={t[lang].contact} onChange={e=>setForm({...form,contact:e.target.value})}/>
        <button>{t[lang].apply}</button>
      </form>

      {seat && <h3>Your Seat: {seat}</h3>}
    </div>
  );
}
