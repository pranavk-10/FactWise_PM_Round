import React, { useMemo, useState } from "react";
import {
  Activity, LayoutDashboard, Users, Thermometer, Stethoscope, ClipboardCheck,
  BarChart3, Search, Bell, Plus, Check, Clock3, AlertTriangle, ArrowUpRight,
  ChevronRight, CalendarDays, ShieldCheck, Menu, X, Download, Filter,
  HeartPulse, BedDouble, CircleCheck, ClipboardList
} from "lucide-react";

const initialPatients = [
  { id:"Q-1024", name:"Aarav Mehta", age:34, room:"A-01", admitted:"Oct 08", temp:36.8, tempTime:"08:14", tempDone:true, doctorDone:true, feverFree:3, status:"Discharge review", notes:"Stable overnight. No fever reported.", history:[36.9,36.7,36.8,36.6,36.8] },
  { id:"Q-1025", name:"Maya Shah", age:28, room:"A-02", admitted:"Oct 09", temp:38.4, tempTime:"08:21", tempDone:true, doctorDone:false, feverFree:0, status:"Doctor pending", notes:"Fever recorded this morning.", history:[38.2,37.9,38.1,38.6,38.4] },
  { id:"Q-1026", name:"Kabir Joshi", age:52, room:"A-03", admitted:"Oct 07", temp:37.1, tempTime:"08:27", tempDone:true, doctorDone:false, feverFree:1, status:"Doctor pending", notes:"Review symptoms and medication plan.", history:[38.1,37.7,37.4,37.2,37.1] },
  { id:"Q-1027", name:"Anaya Rao", age:41, room:"A-04", temp:null, tempTime:null, tempDone:false, doctorDone:false, feverFree:0, status:"Temperature due", notes:"Daily temperature not yet recorded.", history:[37.8,37.6,38.0,37.8,null] },
  { id:"Q-1028", name:"Ishaan Patel", age:63, room:"A-05", admitted:"Oct 10", temp:36.7, tempTime:"08:35", tempDone:true, doctorDone:true, feverFree:2, status:"Monitoring", notes:"Continue current plan; reassess tomorrow.", history:[37.2,37.0,36.9,36.8,36.7] },
  { id:"Q-1029", name:"Sara Khan", age:19, room:"A-06", temp:37.0, tempTime:"08:42", tempDone:true, doctorDone:false, feverFree:2, status:"Doctor pending", notes:"No new concerns reported by nursing.", history:[37.4,37.2,37.1,36.9,37.0] },
  { id:"Q-1030", name:"Vihaan Desai", age:47, room:"A-07", temp:39.1, tempTime:"08:49", tempDone:true, doctorDone:false, feverFree:0, status:"Priority review", notes:"High temperature; prompt clinical review required.", history:[38.3,38.7,38.4,38.9,39.1] },
  { id:"Q-1031", name:"Diya Nair", age:31, room:"A-08", temp:null, tempTime:null, tempDone:false, doctorDone:false, feverFree:0, status:"Temperature due", notes:"Daily temperature not yet recorded.", history:[36.9,37.0,37.1,36.8,null] }
];

const navItems = [
  ["Overview", LayoutDashboard], ["Patients", Users], ["Temperature rounds", Thermometer],
  ["Doctor rounds", Stethoscope], ["Discharges", ClipboardCheck], ["Quality & outcomes", BarChart3]
];

function Badge({children, tone="neutral"}) { return <span className={`badge ${tone}`}>{children}</span>; }
function Metric({label,value,sub,icon:Icon,tone="teal"}) {
  return <div className="metric"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18}/></span></div><div className="metric-value">{value}</div><div className="metric-sub">{sub}</div></div>;
}
function tempTone(t) { if (t == null) return "muted"; if (t >= 38) return "danger"; if (t >= 37.5) return "warning"; return "good"; }
function App() {
  const [patients, setPatients] = useState(initialPatients);
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [newPatient, setNewPatient] = useState({name:"",age:"",room:""});
  const [tempEntry, setTempEntry] = useState(null);
  const [tempValue, setTempValue] = useState("37.0");
  const [tempNote, setTempNote] = useState("");
  const [doctorEntry, setDoctorEntry] = useState(null);
  const [doctorNote, setDoctorNote] = useState("");
  const [discharged, setDischarged] = useState([]);

  const today = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"short", year:"numeric" });
  const activePatients = patients.filter(p => !discharged.includes(p.id));
  const tempDone = activePatients.filter(p=>p.tempDone).length;
  const doctorDone = activePatients.filter(p=>p.doctorDone).length;
  const tempDue = activePatients.filter(p=>!p.tempDone);
  const doctorDue = activePatients.filter(p=>p.tempDone && !p.doctorDone);
  const eligible = activePatients.filter(p=>p.feverFree>=3);
  const filtered = useMemo(()=>activePatients.filter(p=>{
    const q=search.toLowerCase();
    const match = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.room.toLowerCase().includes(q);
    const byFilter = filter==="All" || (filter==="Temperature due"&&!p.tempDone) || (filter==="Doctor pending"&&p.tempDone&&!p.doctorDone) || (filter==="Discharge review"&&p.feverFree>=3);
    return match && byFilter;
  }),[activePatients,search,filter]);

  function notify(msg) { setToast(msg); window.setTimeout(()=>setToast(""),2600); }
  function saveTemp() {
    const value=Number(tempValue);
    if (!Number.isFinite(value)||value<30||value>45) { notify("Enter a valid temperature between 30°C and 45°C."); return; }
    setPatients(prev=>prev.map(p=>p.id===tempEntry.id?{...p,temp:value,tempTime:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),tempDone:true,notes:tempNote||p.notes,history:[...p.history.slice(-4),value],feverFree:value>=38?0:p.feverFree}:p));
    setTempEntry(null); setTempNote(""); notify("Temperature saved. Patient added to the doctor-round queue if needed.");
  }
  function saveDoctor() {
    setPatients(prev=>prev.map(p=>p.id===doctorEntry.id?{...p,doctorDone:true,notes:doctorNote||p.notes}:p));
    setDoctorEntry(null); setDoctorNote(""); notify("Doctor visit recorded.");
  }
  function addPatient(e) {
    e.preventDefault();
    if(!newPatient.name.trim()||!newPatient.room.trim()) return;
    const id="Q-"+(1032+patients.length-8);
    setPatients(prev=>[{id,name:newPatient.name.trim(),age:Number(newPatient.age)||null,room:newPatient.room.trim(),temp:null,tempTime:null,tempDone:false,doctorDone:false,feverFree:0,status:"Temperature due",notes:"New admission — initial assessment pending.",history:[null,null,null,null,null]},...prev]);
    setNewPatient({name:"",age:"",room:""}); setShowAdd(false); setActive("Patients"); notify("Patient added to the active census.");
  }
  function completeDischarge(p) {
    setDischarged(prev=>[...prev,p.id]);
    notify(`${p.name} marked as discharged in this demo.`);
  }
  const patientsPage = active==="Patients" || active==="Temperature rounds" || active==="Doctor rounds" || active==="Discharges";
  const title = active==="Overview"?"Facility overview":active;
  const list = active==="Temperature rounds"?activePatients.filter(p=>!p.tempDone):active==="Doctor rounds"?activePatients.filter(p=>p.tempDone&&!p.doctorDone):active==="Discharges"?activePatients.filter(p=>p.feverFree>=3):filtered;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={21}/></div><div><strong>QuarantineOS</strong><small>FACILITY OPERATIONS</small></div></div>
      <div className="facility-switch"><div className="facility-dot"/> <div><strong>Central Quarantine Centre</strong><small>Facility dashboard</small></div><ChevronRight size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map(([label,Icon])=><button key={label} onClick={()=>setActive(label)} className={`nav-item ${active===label?"selected":""}`}><Icon size={18}/><span>{label}</span>{label==="Temperature rounds"&&tempDue.length>0&&<i>{tempDue.length}</i>}{label==="Doctor rounds"&&doctorDue.length>0&&<i>{doctorDue.length}</i>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><ShieldCheck size={19}/><strong>Care, coordinated.</strong><p>One shared view of each patient's daily care tasks.</p><span>DEMO ENVIRONMENT</span></div><div className="user-profile"><div className="avatar">AD</div><div><strong>Admin Demo</strong><small>Facility administrator</small></div><ChevronRight size={15}/></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb"><span>Facility</span><ChevronRight size={14}/><strong>{title}</strong></div><div className="top-actions"><span className="date"><CalendarDays size={15}/>{today}</span><button className="icon-button" aria-label="Notifications" onClick={()=>notify(`${tempDue.length} temperature checks and ${doctorDue.length} doctor visits remain.`)}><Bell size={18}/><em/></button><div className="avatar small">AD</div></div></header>
      <div className="page">
        <div className="page-heading"><div><div className="eyebrow">CLINICAL OPERATIONS <span>•</span> LIVE DEMO DATA</div><h1>{title}</h1><p>{active==="Overview"?"A clear view of today's care tasks, patient flow, and facility capacity.":active==="Temperature rounds"?"Record one temperature per patient per day and keep rounds moving.":active==="Doctor rounds"?"Visit patients after their temperature has been recorded.":active==="Discharges"?"Review patients meeting the configured fever-free criterion and track discharge completion.":active==="Quality & outcomes"?"Monitor outcome trends with explicit denominators and reporting periods.":"Search, review, and update the active patient census."}</p></div><div className="heading-actions"><button className="button secondary" onClick={()=>{const csv=["id,name,room,temperature_c,temp_recorded,doctor_visited,fever_free_days,status",...activePatients.map(p=>[p.id,`"${p.name}"`,p.room,p.temp??"",p.tempDone,p.doctorDone,p.feverFree,p.status].join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="quarantineos-patient-census-demo.csv";a.click();URL.revokeObjectURL(a.href);notify("Demo census exported as CSV.")}}><Download size={16}/> Export</button><button className="button primary" onClick={()=>setShowAdd(true)}><Plus size={17}/> Add patient</button></div></div>

        {active==="Overview" && <>
          <div className="notice"><div className="notice-icon"><AlertTriangle size={18}/></div><div><strong>Daily workflow needs attention</strong><p>{tempDue.length} temperature checks and {doctorDue.length} doctor visits remain open in this demo. Prioritize any clinically urgent patient according to facility protocol.</p></div><button onClick={()=>setActive("Temperature rounds")}>Review tasks <ChevronRight size={16}/></button></div>
          <div className="metrics-grid">
            <Metric label="Occupied beds" value={`${activePatients.length} / 74`} sub={`${Math.round(activePatients.length/74*100)}% of facility capacity`} icon={BedDouble}/>
            <Metric label="Temperatures recorded" value={`${tempDone} / ${activePatients.length}`} sub={`${tempDue.length} still due today`} icon={Thermometer} tone="blue"/>
            <Metric label="Doctor visits complete" value={`${doctorDone} / ${activePatients.length}`} sub={`${doctorDue.length} waiting after temperature`} icon={Stethoscope} tone="purple"/>
            <Metric label="Discharge reviews" value={eligible.length} sub="Meet 3-day criterion in demo data" icon={ClipboardCheck} tone="amber"/>
          </div>
          <div className="content-grid">
            <section className="panel tasks-panel"><div className="panel-header"><div><h2>Today's care workflow</h2><p>Track completion across the active census</p></div><Badge tone="info">Today</Badge></div>
              <div className="workflow-row"><div className="workflow-icon blue-bg"><Thermometer size={19}/></div><div className="workflow-copy"><strong>Temperature rounds</strong><span>Record each patient's daily temperature</span><div className="progress"><span style={{width:`${activePatients.length?tempDone/activePatients.length*100:0}%`}}/></div></div><div className="workflow-count"><strong>{tempDone}/{activePatients.length}</strong><span>complete</span></div><button className="round-arrow" onClick={()=>setActive("Temperature rounds")}><ChevronRight size={18}/></button></div>
              <div className="workflow-row"><div className="workflow-icon purple-bg"><Stethoscope size={19}/></div><div className="workflow-copy"><strong>Doctor rounds</strong><span>Visit after the temperature is recorded</span><div className="progress purple-progress"><span style={{width:`${activePatients.length?doctorDone/activePatients.length*100:0}%`}}/></div></div><div className="workflow-count"><strong>{doctorDone}/{activePatients.length}</strong><span>complete</span></div><button className="round-arrow" onClick={()=>setActive("Doctor rounds")}><ChevronRight size={18}/></button></div>
              <div className="workflow-row"><div className="workflow-icon green-bg"><ClipboardCheck size={19}/></div><div className="workflow-copy"><strong>Discharge coordination</strong><span>Review eligible patients and notify administration</span><div className="progress green-progress"><span style={{width:`${activePatients.length?Math.min(100,eligible.length/Math.max(1,activePatients.length)*100):0}%`}}/></div></div><div className="workflow-count"><strong>{eligible.length}</strong><span>to review</span></div><button className="round-arrow" onClick={()=>setActive("Discharges")}><ChevronRight size={18}/></button></div>
              <div className="panel-foot"><CircleCheck size={16}/> A completed task is visible to the whole team in this prototype.</div>
            </section>
            <section className="panel queue-panel"><div className="panel-header"><div><h2>Needs attention</h2><p>Suggested operational priorities</p></div><span className="queue-total">{tempDue.length+doctorDue.length+eligible.length}</span></div>
              {activePatients.filter(p=>p.temp>=38).slice(0,2).map(p=><div className="attention-item" key={p.id}><div className="attention-symbol red"><AlertTriangle size={17}/></div><div className="attention-copy"><strong>{p.name}</strong><span>{p.room} · {p.temp}°C recorded</span></div><Badge tone="danger">High temp</Badge></div>)}
              {tempDue.slice(0,2).map(p=><div className="attention-item" key={p.id}><div className="attention-symbol amber"><Thermometer size={17}/></div><div className="attention-copy"><strong>{p.name}</strong><span>{p.room} · temperature not recorded</span></div><Badge tone="warning">Due</Badge></div>)}
              {eligible.slice(0,2).map(p=><div className="attention-item" key={p.id}><div className="attention-symbol green"><ClipboardCheck size={17}/></div><div className="attention-copy"><strong>{p.name}</strong><span>{p.room} · {p.feverFree} fever-free days</span></div><Badge tone="success">Review</Badge></div>)}
              <button className="text-button" onClick={()=>setActive("Patients")}>View all patients <ArrowUpRight size={15}/></button>
            </section>
          </div>
          <section className="panel table-panel"><div className="panel-header"><div><h2>Patient overview</h2><p>Latest status across today's active patients</p></div><button className="text-button" onClick={()=>setActive("Patients")}>View patient list <ChevronRight size={15}/></button></div><PatientTable patients={activePatients.slice(0,5)} onTemp={p=>{setTempEntry(p);setTempValue(p.temp?.toFixed(1)||"37.0")}} onDoctor={p=>{setDoctorEntry(p)}}/></section>
        </>}

        {patientsPage && <section className="panel table-panel full-table"><div className="list-toolbar"><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, patient ID, or room…"/></div><div className="filter-wrap"><Filter size={16}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Temperature due</option><option>Doctor pending</option><option>Discharge review</option></select></div><span className="result-count">{list.length} patients</span></div><PatientTable patients={list} onTemp={p=>{setTempEntry(p);setTempValue(p.temp?.toFixed(1)||"37.0")}} onDoctor={p=>setDoctorEntry(p)} onDischarge={completeDischarge} view={active}/></section>}

        {active==="Quality & outcomes" && <div className="quality-layout"><div className="metrics-grid quality-metrics"><Metric label="Expected survival benchmark" value="85%" sub="Derived from stated 15% mortality benchmark" icon={HeartPulse}/><Metric label="Expected mortality benchmark" value="15%" sub="Compare like-for-like reporting periods" icon={Activity} tone="amber"/><Metric label="Discharged in this demo" value={discharged.length} sub="Prototype actions only" icon={ClipboardCheck} tone="blue"/><Metric label="Active census" value={activePatients.length} sub="Fictional sample records" icon={Users} tone="purple"/></div><section className="panel quality-panel"><div className="panel-header"><div><h2>Outcome monitoring framework</h2><p>Do not infer clinical performance from the small sample dataset.</p></div><Badge tone="warning">Demo only</Badge></div><div className="benchmark-row"><div><strong>Mortality rate</strong><span>Deaths among all defined cases in reporting period</span></div><strong>Deaths ÷ eligible cases × 100</strong></div><div className="benchmark-row"><div><strong>Survival rate</strong><span>Survivors among the same defined case cohort</span></div><strong>Survivors ÷ eligible cases × 100</strong></div><div className="benchmark-row"><div><strong>Escalation rule</strong><span>Review when mortality exceeds the agreed threshold</span></div><strong>Above 15%</strong></div><div className="safety-note"><ShieldCheck size={19}/><p>Before production use, clinical leadership must define the cohort, outcome window, transfer/death handling, and small-sample alert rules. This prototype does not contain real outcome data and does not calculate an actual mortality rate.</p></div></section></div>}

        <footer className="page-footer"><span><ShieldCheck size={14}/> QuarantineOS prototype · fictional data · not for clinical use</span><span>Built for operational clarity <span className="footer-dot">•</span> v0.1</span></footer>
      </div>
    </main>

    {showAdd&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAdd(false)}}><form className="modal" onSubmit={addPatient}><div className="modal-head"><div><h2>Add patient</h2><p>Create a demo patient record for the active census.</p></div><button type="button" className="icon-button" onClick={()=>setShowAdd(false)}><X size={18}/></button></div><label>Patient name<input required autoFocus value={newPatient.name} onChange={e=>setNewPatient({...newPatient,name:e.target.value})} placeholder="Full name"/></label><div className="form-row"><label>Age<input type="number" min="0" max="120" value={newPatient.age} onChange={e=>setNewPatient({...newPatient,age:e.target.value})} placeholder="Age"/></label><label>Room / bed<input required value={newPatient.room} onChange={e=>setNewPatient({...newPatient,room:e.target.value})} placeholder="e.g. B-04"/></label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="button primary" type="submit"><Plus size={16}/> Add patient</button></div></form></div>}

    {tempEntry&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setTempEntry(null)}}><form className="modal" onSubmit={e=>{e.preventDefault();saveTemp()}}><div className="modal-head"><div><h2>Record temperature</h2><p>{tempEntry.name} · {tempEntry.id} · Room {tempEntry.room}</p></div><button type="button" className="icon-button" onClick={()=>setTempEntry(null)}><X size={18}/></button></div>{tempEntry.tempDone&&<div className="inline-alert"><AlertTriangle size={16}/> A temperature is already recorded today. Saving again will overwrite today's value in this demo.</div>}<label>Temperature (°C)<input type="number" step="0.1" min="30" max="45" required value={tempValue} onChange={e=>setTempValue(e.target.value)}/></label><label>Observation / note<textarea rows="3" value={tempNote} onChange={e=>setTempNote(e.target.value)} placeholder="Optional factual observation…"/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setTempEntry(null)}>Cancel</button><button className="button primary" type="submit"><Check size={16}/> Save reading</button></div><p className="modal-disclaimer">Demo only. Production workflow should preserve an audit trail rather than silently overwrite a reading.</p></form></div>}

    {doctorEntry&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDoctorEntry(null)}}><form className="modal" onSubmit={e=>{e.preventDefault();saveDoctor()}}><div className="modal-head"><div><h2>Record doctor visit</h2><p>{doctorEntry.name} · {doctorEntry.id} · Room {doctorEntry.room}</p></div><button type="button" className="icon-button" onClick={()=>setDoctorEntry(null)}><X size={18}/></button></div>{!doctorEntry.tempDone&&<div className="inline-alert"><AlertTriangle size={16}/> No temperature is recorded today. The operational workflow expects temperature first; follow clinical protocol for urgent exceptions.</div>}<div className="patient-summary"><div><span>Latest temperature</span><strong>{doctorEntry.temp==null?"Not recorded":`${doctorEntry.temp}°C`}</strong></div><div><span>Fever-free days</span><strong>{doctorEntry.feverFree}</strong></div></div><label>Visit note<input value={doctorNote} onChange={e=>setDoctorNote(e.target.value)} placeholder="e.g. reviewed symptoms and plan"/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setDoctorEntry(null)}>Cancel</button><button className="button primary" type="submit"><Check size={16}/> Mark visit complete</button></div></form></div>}

    {toast&&<div className="toast"><CircleCheck size={18}/>{toast}</div>}
  </div>;
}

function PatientTable({patients,onTemp,onDoctor,onDischarge,view}) {
  return <div className="table-scroll"><table><thead><tr><th>PATIENT</th><th>ROOM</th><th>TEMPERATURE</th><th>TODAY'S TASKS</th><th>FEVER-FREE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{patients.length===0?<tr><td colSpan="7" className="empty-state"><ClipboardList size={26}/><strong>No matching patients</strong><span>Try changing the search or filter.</span></td></tr>:patients.map(p=><tr key={p.id}><td><div className="patient-cell"><div className={`patient-avatar ${p.temp>=38?"hot":""}`}>{p.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div><strong>{p.name}</strong><span>{p.id}{p.age?` · ${p.age} yrs`:""}</span></div></div></td><td><span className="room">{p.room}</span></td><td>{p.temp==null?<span className="temp-empty">— Not taken</span>:<div className="temp-cell"><strong className={tempTone(p.temp)}>{p.temp.toFixed(1)}°C</strong><span>{p.tempTime||"Today"}</span></div>}</td><td><div className="task-pills"><span className={p.tempDone?"task-done":"task-pending"}>{p.tempDone?<Check size={12}/>:<Clock3 size={12}/>} Temp</span><span className={p.doctorDone?"task-done":"task-pending"}>{p.doctorDone?<Check size={12}/>:<Clock3 size={12}/>} Doctor</span></div></td><td><span className={`fever-days ${p.feverFree>=3?"eligible":""}`}>{p.feverFree} / 3 days</span></td><td><Badge tone={p.feverFree>=3?"success":!p.tempDone?"warning":p.temp>=38?"danger":p.tempDone&&!p.doctorDone?"info":"neutral"}>{p.feverFree>=3?"Discharge review":!p.tempDone?"Temperature due":p.temp>=38?"High temperature":p.tempDone&&!p.doctorDone?"Doctor pending":"Monitoring"}</Badge></td><td><div className="row-actions">{view==="Discharges"?<button className="small-action discharge" onClick={()=>onDischarge?.(p)}>Discharge</button>:!p.tempDone||view==="Temperature rounds"?<button className="small-action" onClick={()=>onTemp(p)}><Thermometer size={14}/> Record</button>:!p.doctorDone||view==="Doctor rounds"?<button className="small-action" onClick={()=>onDoctor(p)}><Stethoscope size={14}/> Visit</button>:<button className="small-action quiet" onClick={()=>onTemp(p)}>View / edit</button>}</div></td></tr>)}</tbody></table></div>;
}
export default App;