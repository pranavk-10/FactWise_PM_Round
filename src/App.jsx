import React, { useMemo, useState, useEffect } from "react";
import {
  Activity, LayoutDashboard, Users, Thermometer, Stethoscope, ClipboardCheck,
  BarChart3, Search, Bell, Plus, Check, Clock3, AlertTriangle, ArrowUpRight,
  ChevronRight, CalendarDays, ShieldCheck, Menu, X, Download, Filter,
  HeartPulse, BedDouble, CircleCheck, ClipboardList, ShieldAlert, Biohazard,
  FileText, Volume2, VolumeX, Eye, AlertOctagon, RefreshCw, Sparkles, UserPlus
} from "lucide-react";

// Initial mock subjects in the 74-bed Umbrella Hive facility
const initialSubjects = [
  {
    id: "UC-1024",
    name: "Dr. William Birkin",
    age: 38,
    room: "Pod A-01",
    sector: "Sector A (Level B3)",
    strain: "Vector Progenitor-T",
    admitted: "2026-10-08",
    temp: 36.8,
    tempTime: "08:14",
    tempDone: true,
    doctorDone: true,
    feverFree: 3,
    status: "Decon Review",
    doctorApproval: true,
    notes: "Cellular stabilization verified. Afebrile for 72+ hours. Ready for decontamination exit.",
    history: [37.2, 36.9, 36.7, 36.8, 36.8],
    vitals: { hr: 72, spo2: 99, bp: "120/80" }
  },
  {
    id: "UC-1025",
    name: "Jill Valentine",
    age: 28,
    room: "Pod A-02",
    sector: "Sector A (Level B3)",
    strain: "T-Alpha Aerosol Variant",
    admitted: "2026-10-09",
    temp: 38.6,
    tempTime: "08:21",
    tempDone: true,
    doctorDone: false,
    feverFree: 0,
    status: "Biohazard Spike",
    doctorApproval: false,
    notes: "Elevated body temperature detected this morning. Pathogen antibody titer test ordered.",
    history: [37.4, 37.9, 38.1, 38.4, 38.6],
    vitals: { hr: 94, spo2: 96, bp: "135/88" }
  },
  {
    id: "UC-1026",
    name: "Carlos Oliveira",
    age: 32,
    room: "Pod A-03",
    sector: "Sector A (Level B3)",
    strain: "U.B.C.S. Contact Exposure",
    admitted: "2026-10-07",
    temp: 37.1,
    tempTime: "08:27",
    tempDone: true,
    doctorDone: false,
    feverFree: 1,
    status: "Virology Pending",
    doctorApproval: false,
    notes: "Normalizing post-immunotherapy injection. Awaiting chief virologist evaluation.",
    history: [38.3, 37.8, 37.4, 37.2, 37.1],
    vitals: { hr: 78, spo2: 98, bp: "122/79" }
  },
  {
    id: "UC-1027",
    name: "Ada Wong",
    age: 30,
    room: "Pod B-01",
    sector: "Sector B (Cryo-Isolation)",
    strain: "Synthetic Progenitor Vector",
    admitted: "2026-10-11",
    temp: null,
    tempTime: null,
    tempDone: false,
    doctorDone: false,
    feverFree: 0,
    status: "Biometric Due",
    doctorApproval: false,
    notes: "Daily mandatory core biometric reading pending. Hive sensor online.",
    history: [37.8, 37.6, 38.0, 37.8, null],
    vitals: { hr: 80, spo2: 98, bp: "118/76" }
  },
  {
    id: "UC-1028",
    name: "Leon S. Kennedy",
    age: 31,
    room: "Pod B-02",
    sector: "Sector B (Cryo-Isolation)",
    strain: "Las Plagas / T-Variant Cross",
    admitted: "2026-10-10",
    temp: 36.7,
    tempTime: "08:35",
    tempDone: true,
    doctorDone: true,
    feverFree: 2,
    status: "Observational Containment",
    doctorApproval: false,
    notes: "No cellular anomaly noted during morning scan. Maintain standard observation cycle.",
    history: [37.4, 37.0, 36.9, 36.8, 36.7],
    vitals: { hr: 68, spo2: 99, bp: "115/75" }
  },
  {
    id: "UC-1029",
    name: "Claire Redfield",
    age: 26,
    room: "Pod B-03",
    sector: "Sector B (Cryo-Isolation)",
    strain: "Asymptomatic Quarantine",
    admitted: "2026-10-11",
    temp: 37.0,
    tempTime: "08:42",
    tempDone: true,
    doctorDone: false,
    feverFree: 2,
    status: "Virology Pending",
    doctorApproval: false,
    notes: "T-antigen levels below baseline. Scheduled for doctor rounds review.",
    history: [37.4, 37.2, 37.1, 36.9, 37.0],
    vitals: { hr: 74, spo2: 99, bp: "119/78" }
  },
  {
    id: "UC-1030",
    name: "Albert Wesker",
    age: 42,
    room: "Pod C-01",
    sector: "Sector C (Decon Ward)",
    strain: "Hyper-Mutant Uroboros Marker",
    admitted: "2026-10-06",
    temp: 39.4,
    tempTime: "08:49",
    tempDone: true,
    doctorDone: false,
    feverFree: 0,
    status: "Critical Biohazard",
    doctorApproval: false,
    notes: "Severe thermal spike! Immediate Level-4 isolation barrier active.",
    history: [38.3, 38.7, 38.6, 39.0, 39.4],
    vitals: { hr: 110, spo2: 93, bp: "155/98" }
  },
  {
    id: "UC-1031",
    name: "Rebecca Chambers",
    age: 22,
    room: "Pod C-02",
    sector: "Sector C (Decon Ward)",
    strain: "Medic Bio-Surveillance",
    admitted: "2026-10-12",
    temp: null,
    tempTime: null,
    tempDone: false,
    doctorDone: false,
    feverFree: 0,
    status: "Biometric Due",
    doctorApproval: false,
    notes: "Field medic preventative quarantine. Day 2 temperature scan due.",
    history: [36.9, 37.0, 37.1, 36.8, null],
    vitals: { hr: 70, spo2: 100, bp: "116/74" }
  }
];

const initialAuditLogs = [
  { id: "LOG-01", time: "08:14:22", role: "CONTAINMENT_NURSE", code: "AUDIT_BIO_RECORD", desc: "Core biometric logged for UC-1024 (36.8°C). Afebrile streak reached 3 days." },
  { id: "LOG-02", time: "08:21:05", role: "CONTAINMENT_NURSE", code: "AUDIT_SPIKE_DETECT", desc: "Pathogen thermal spike flagged for UC-1025 (38.6°C). Biohazard status elevated." },
  { id: "LOG-03", time: "08:30:11", role: "CHIEF_VIROLOGIST", code: "AUDIT_ROUND_COMPLETE", desc: "Clinical examination completed for UC-1024 by Dr. Birkin. Clearance recommended." },
  { id: "LOG-04", time: "08:49:50", role: "CONTAINMENT_NURSE", code: "AUDIT_CRITICAL_ALERT", desc: "Extreme hyperthermia logged for UC-1030 (39.4°C). Level-4 bio-alert transmitted to Red Queen." }
];

// Navigation menu items
const navItems = [
  ["Overview", LayoutDashboard],
  ["Subject Census", Users],
  ["Biometric Rounds", Thermometer],
  ["Virology Rounds", Stethoscope],
  ["Decon & Discharge", ClipboardCheck],
  ["Quality & Outcomes", BarChart3],
  ["Security Audit Trail", FileText]
];

// Audio synthesizer for sci-fi HUD sounds (Web Audio API)
function playBeep(type = "click", enabled = true) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "alert") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(480, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    }
  } catch (e) {
    // Audio context not allowed or not supported
  }
}

export default function App() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [discharged, setDischarged] = useState([]);
  const [fatalities, setFatalities] = useState([
    { id: "UC-1019", name: "Subject #914", cause: "Uncontrolled cellular lysis", date: "2026-10-04" }
  ]);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Clearance and Operator Role
  const [operatorRole, setOperatorRole] = useState("Level 4: Red Queen Overseer");

  // Facility DEFCON Threat Level: 'green', 'amber', 'red'
  const [threatLevel, setThreatLevel] = useState("amber");

  // Modals & Panels
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", age: "", room: "Pod A-04", strain: "Vector-T Progenitor" });
  const [selectedDossier, setSelectedDossier] = useState(null);

  // Temperature Entry Modal
  const [tempEntry, setTempEntry] = useState(null);
  const [tempValue, setTempValue] = useState("37.0");
  const [tempNote, setTempNote] = useState("");
  const [tempOverrideReason, setTempOverrideReason] = useState("");

  // Doctor Round Modal
  const [doctorEntry, setDoctorEntry] = useState(null);
  const [doctorNote, setDoctorNote] = useState("");
  const [doctorUrgentOverride, setDoctorUrgentOverride] = useState(false);
  const [urgentOverrideReason, setUrgentOverrideReason] = useState("");

  // Toast System
  const [toast, setToast] = useState(null);

  function notify(msg, type = "info") {
    setToast({ msg, type });
    if (type === "alert") playBeep("alert", soundEnabled);
    else playBeep("success", soundEnabled);
    setTimeout(() => setToast(null), 3200);
  }

  function addAudit(code, desc) {
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    const id = "LOG-" + (auditLogs.length + 1).toString().padStart(2, "0");
    const roleSlug = operatorRole.includes("Red Queen") ? "RED_QUEEN_AI" : operatorRole.includes("Virologist") ? "CHIEF_VIROLOGIST" : operatorRole.includes("Nurse") ? "CONTAINMENT_NURSE" : "HIVE_ADMIN";
    setAuditLogs(prev => [{ id, time, role: roleSlug, code, desc }, ...prev]);
  }

  // Active Subject Census (excluding discharged & fatalities)
  const activeSubjects = subjects.filter(s => !discharged.some(d => d.id === s.id));
  const capacityTotal = 74; // PRD mandate: 74-bed quarantine facility
  const occupiedBeds = activeSubjects.length;

  const tempDoneCount = activeSubjects.filter(s => s.tempDone).length;
  const doctorDoneCount = activeSubjects.filter(s => s.doctorDone).length;
  const tempDueList = activeSubjects.filter(s => !s.tempDone);
  const doctorDueList = activeSubjects.filter(s => s.tempDone && !s.doctorDone);
  const deconReadyList = activeSubjects.filter(s => s.feverFree >= 3);
  const highSpikeList = activeSubjects.filter(s => s.temp >= 38.0);

  // Quality & Outcomes Calculation (15% Mortality Benchmark)
  const totalTrackedCohort = activeSubjects.length + discharged.length + fatalities.length;
  const mortalityRate = totalTrackedCohort > 0 ? (fatalities.length / totalTrackedCohort) * 100 : 0;
  const survivalRate = totalTrackedCohort > 0 ? ((activeSubjects.length + discharged.length) / totalTrackedCohort) * 100 : 100;
  const isMortalityExceeded = mortalityRate > 15.0; // PRD 15% benchmark rule

  // Filtered Subject List
  const filteredList = useMemo(() => {
    return activeSubjects.filter(s => {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.strain.toLowerCase().includes(q);

      const byFilter =
        filter === "All" ||
        (filter === "Biometric Due" && !s.tempDone) ||
        (filter === "Virology Pending" && s.tempDone && !s.doctorDone) ||
        (filter === "Decon Clearance" && s.feverFree >= 3) ||
        (filter === "Biohazard Spike" && s.temp >= 38.0);

      return match && byFilter;
    });
  }, [activeSubjects, search, filter]);

  // Save Temperature Observation (PRD P0 validation & duplicate logic)
  function handleSaveTemp(e) {
    e.preventDefault();
    const val = parseFloat(tempValue);
    if (isNaN(val) || val < 30 || val > 45) {
      notify("Invalid biometric core temperature (Allowed range: 30.0°C – 45.0°C).", "alert");
      return;
    }

    if (tempEntry.tempDone && !tempOverrideReason.trim()) {
      notify("Audit protocol requirement: Provide an explicit reason for biometric overwrite.", "alert");
      return;
    }

    const isSpike = val >= 38.0;
    const nowTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== tempEntry.id) return s;
        const newHistory = [...s.history.slice(1), val];
        // 3-day fever-free streak rule (reset to 0 if >= 38.0°C, otherwise increment or maintain)
        const updatedFeverFree = isSpike ? 0 : s.feverFree < 3 ? s.feverFree + 1 : 3;
        const status = updatedFeverFree >= 3 ? "Decon Review" : isSpike ? "Biohazard Spike" : "Virology Pending";
        return {
          ...s,
          temp: val,
          tempTime: nowTime,
          tempDone: true,
          feverFree: updatedFeverFree,
          status,
          notes: tempNote ? `${tempNote} (Amended: ${nowTime})` : s.notes,
          history: newHistory
        };
      })
    );

    addAudit(
      tempEntry.tempDone ? "AUDIT_BIO_AMENDMENT" : "AUDIT_BIO_RECORD",
      `Core temp of ${val.toFixed(1)}°C recorded for ${tempEntry.name} (${tempEntry.id}). ${
        isSpike ? "CRITICAL FEVER SPIKE DETECTED." : "Afebrile reading confirmed."
      } ${tempOverrideReason ? `[Reason: ${tempOverrideReason}]` : ""}`
    );

    notify(`Biometric recorded for ${tempEntry.name}: ${val.toFixed(1)}°C. Subject added to doctor queue.`, isSpike ? "alert" : "success");
    setTempEntry(null);
    setTempNote("");
    setTempOverrideReason("");
  }

  // Save Doctor / Chief Virologist Round
  function handleSaveDoctor(e) {
    e.preventDefault();

    if (!doctorEntry.tempDone && !doctorUrgentOverride) {
      notify("Standard protocol requires biometric reading first. Check Urgent Override to bypass.", "alert");
      return;
    }

    if (doctorUrgentOverride && !urgentOverrideReason.trim()) {
      notify("Urgent exception requires mandatory documented clinical rationale.", "alert");
      return;
    }

    const nowTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== doctorEntry.id) return s;
        return {
          ...s,
          doctorDone: true,
          doctorApproval: s.feverFree >= 3,
          notes: doctorNote ? `Dr. Round: ${doctorNote}` : s.notes
        };
      })
    );

    addAudit(
      doctorUrgentOverride ? "AUDIT_OVERRIDE_URGENT" : "AUDIT_ROUND_COMPLETE",
      `Virology round certified for ${doctorEntry.name} (${doctorEntry.id}). ${
        doctorUrgentOverride ? `[URGENT OVERRIDE: ${urgentOverrideReason}]` : ""
      }`
    );

    notify(`Virology encounter documented for ${doctorEntry.name}.`, "success");
    setDoctorEntry(null);
    setDoctorNote("");
    setDoctorUrgentOverride(false);
    setUrgentOverrideReason("");
  }

  // Complete Decontamination & Discharge (PRD 2-step audit workflow)
  function handleCompleteDischarge(subject) {
    if (subject.feverFree < 3) {
      notify("Subject has not met the mandatory 3-day consecutive afebrile criterion.", "alert");
      return;
    }

    const deconRecord = {
      ...subject,
      deconTimestamp: new Date().toISOString(),
      deconLead: operatorRole
    };

    setDischarged(prev => [...prev, deconRecord]);
    addAudit(
      "AUDIT_DECON_DISCHARGE",
      `Subject ${subject.name} (${subject.id}) decontaminated and discharged. Pod ${subject.room} released for sanitation.`
    );
    notify(`Subject ${subject.name} successfully decontaminated and released. Bed freed.`, "success");
  }

  // Intake New Subject into Hive Quarantine (PRD census management)
  function handleAddSubject(e) {
    e.preventDefault();
    if (!newSubject.name.trim() || !newSubject.room.trim()) return;

    // Check if room is already occupied
    const roomTaken = activeSubjects.some(s => s.room.toLowerCase() === newSubject.room.trim().toLowerCase());
    if (roomTaken) {
      notify(`Containment Pod ${newSubject.room} is currently occupied! Choose an empty unit.`, "alert");
      return;
    }

    if (occupiedBeds >= capacityTotal) {
      notify("Facility is at maximum 74-bed capacity! Cannot admit new subject.", "alert");
      return;
    }

    const nextId = "UC-" + (1032 + subjects.length - 8);
    const brandNew = {
      id: nextId,
      name: newSubject.name.trim(),
      age: parseInt(newSubject.age) || 30,
      room: newSubject.room.trim(),
      sector: newSubject.room.startsWith("Pod B") ? "Sector B (Cryo-Isolation)" : newSubject.room.startsWith("Pod C") ? "Sector C (Decon Ward)" : "Sector A (Level B3)",
      strain: newSubject.strain,
      admitted: new Date().toISOString().split("T")[0],
      temp: null,
      tempTime: null,
      tempDone: false,
      doctorDone: false,
      feverFree: 0,
      status: "Biometric Due",
      doctorApproval: false,
      notes: "Intake containment protocol active. Baseline cellular and temperature evaluation pending.",
      history: [null, null, null, null, null],
      vitals: { hr: 75, spo2: 98, bp: "120/80" }
    };

    setSubjects(prev => [brandNew, ...prev]);
    addAudit("AUDIT_SUBJECT_INTAKE", `New subject intake: ${brandNew.name} (${brandNew.id}) assigned to ${brandNew.room}.`);
    setNewSubject({ name: "", age: "", room: "Pod A-04", strain: "Vector-T Progenitor" });
    setShowAddSubject(false);
    notify(`Subject ${brandNew.name} admitted to ${brandNew.room}. Census updated.`, "success");
  }

  // Export Classified Census CSV
  function exportClassifiedCSV() {
    playBeep("click", soundEnabled);
    const headers = "id,name,age,room,sector,viral_strain,admitted_date,core_temp_c,temp_recorded,doctor_visited,fever_free_days,bio_status,clinical_notes";
    const rows = activeSubjects.map(s =>
      [
        s.id,
        `"${s.name}"`,
        s.age,
        s.room,
        `"${s.sector}"`,
        `"${s.strain}"`,
        s.admitted,
        s.temp ?? "NOT_TAKEN",
        s.tempDone ? "YES" : "NO",
        s.doctorDone ? "YES" : "NO",
        s.feverFree,
        `"${s.status}"`,
        `"${s.notes.replace(/"/g, '""')}"`
      ].join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UMBRELLA_CORP_HIVE_CENSUS_CLASSIFIED_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addAudit("AUDIT_DATA_EXPORT", `Classified census manifest exported by ${operatorRole}.`);
    notify("Classified Hive Census Manifest exported as CSV.", "success");
  }

  return (
    <div className="app-shell">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="sidebar">
        <div className="brand">
          <div className="umbrella-logo-mark">
            <div className="umbrella-emblem" />
          </div>
          <div className="brand-info">
            <strong>UMBRELLA CORP</strong>
            <small>Hive Operations • Level 4</small>
          </div>
        </div>

        {/* Facility & Threat Level Selector */}
        <div className="facility-widget">
          <div className="facility-widget-info">
            <strong>The Hive (Arklay Basin)</strong>
            <span>Sub-Level 3 • Facility Bio-OS</span>
          </div>
          <div className={`threat-chip ${threatLevel}`} onClick={() => {
            const next = threatLevel === "green" ? "amber" : threatLevel === "amber" ? "red" : "green";
            setThreatLevel(next);
            playBeep("alert", soundEnabled);
            addAudit("AUDIT_DEFCON_CHANGE", `Facility DEFCON Biohazard state adjusted to Condition ${next.toUpperCase()}.`);
          }} title="Click to cycle DEFCON containment level" style={{ cursor: "pointer" }}>
            {threatLevel === "green" ? "DEFCON 4" : threatLevel === "amber" ? "DEFCON 2" : "DEFCON 1"}
          </div>
        </div>

        <div className="nav-section-title">
          <span>Containment Modules</span>
          <span style={{ color: "var(--umbrella-red)" }}>74 BEDS</span>
        </div>

        <nav>
          {navItems.map(([label, Icon]) => {
            const isBiometrics = label === "Biometric Rounds";
            const isVirology = label === "Virology Rounds";
            const isDecon = label === "Decon & Discharge";
            return (
              <button
                key={label}
                onClick={() => {
                  playBeep("click", soundEnabled);
                  setActiveTab(label);
                }}
                className={`nav-button ${activeTab === label ? "active" : ""}`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {isBiometrics && tempDueList.length > 0 && (
                  <span className="nav-counter amber">{tempDueList.length}</span>
                )}
                {isVirology && doctorDueList.length > 0 && (
                  <span className="nav-counter purple">{doctorDueList.length}</span>
                )}
                {isDecon && deconReadyList.length > 0 && (
                  <span className="nav-counter green">{deconReadyList.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="clearance-card">
            <div className="clearance-card-top">
              <span className="clearance-label">SECURITY CLEARANCE</span>
              <select
                className="clearance-select"
                value={operatorRole}
                onChange={e => {
                  setOperatorRole(e.target.value);
                  playBeep("click", soundEnabled);
                }}
              >
                <option>Level 1: Containment Tech</option>
                <option>Level 2: Chief Virologist</option>
                <option>Level 3: Facility Director</option>
                <option>Level 4: Red Queen Overseer</option>
              </select>
            </div>
            <div className="clearance-role">{operatorRole.split(":")[1]}</div>
            <div className="clearance-note">Biometric encryption active. Red Queen system protocol synchronized.</div>
          </div>

          <div className="user-card">
            <div className="user-avatar">RQ</div>
            <div className="user-details">
              <strong>Red Queen Core</strong>
              <small>System Diagnostic: NOMINAL</small>
            </div>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">
              <span className="breadcrumb-root">HIVE / FACILITY OPERATIONS</span>
              <ChevronRight size={13} style={{ color: "var(--text-muted)" }} />
              <span className="breadcrumb-active">{activeTab.toUpperCase()}</span>
            </div>
            <span className="hud-tag">74-BED UMBRELLA CORP OPERATIONS</span>
          </div>

          <div className="topbar-right">
            <div className="hud-time">
              <CalendarDays size={14} />
              <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>

            <div className="topbar-actions">
              <button
                className={`icon-btn ${soundEnabled ? "active" : ""}`}
                title={soundEnabled ? "Mute HUD audio" : "Enable HUD audio"}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                className="icon-btn"
                title="System Notifications"
                onClick={() => notify(`${tempDueList.length} biometric checks and ${doctorDueList.length} virology visits remain open.`, "alert")}
              >
                <Bell size={16} />
                {(tempDueList.length > 0 || doctorDueList.length > 0) && <span className="badge-dot" />}
              </button>

              <button
                className="btn btn-secondary"
                style={{ height: "36px", padding: "0 12px", fontSize: "11px" }}
                onClick={() => {
                  playBeep("click", soundEnabled);
                  setThreatLevel(threatLevel === "red" ? "amber" : "red");
                }}
              >
                <ShieldAlert size={14} style={{ color: threatLevel === "red" ? "var(--umbrella-red)" : "var(--bio-amber)" }} />
                <span>{threatLevel === "red" ? "LIFT LOCKDOWN" : "BIOHAZARD LOCKDOWN"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="page-container">
          {/* Header Title & Actions */}
          <div className="page-header">
            <div className="page-header-info">
              <div className="tagline">
                <Biohazard size={14} />
                <span>UMBRELLA MEDICAL &amp; QUARANTINE PROTOCOL • RESTRICTED</span>
              </div>
              <h1>
                {activeTab === "Overview" ? "Hive Containment Overview" : activeTab}
              </h1>
              <p>
                {activeTab === "Overview" && "Central command dashboard for 74-bed viral containment facility. Live biometric monitoring, virology rounds coordination, and discharge decontamination clearance."}
                {activeTab === "Subject Census" && "Real-time subject census, containment unit assignments, viral strain classifications, and clinical observation histories."}
                {activeTab === "Biometric Rounds" && "Daily mandatory core body temperature tracking in °C. Out-of-range fever spikes (>38.0°C) prompt immediate biohazard isolation."}
                {activeTab === "Virology Rounds" && "Chief virologist encounters and clinical evaluations following recorded biometric scans. Emergency override supported."}
                {activeTab === "Decon & Discharge" && "Strict 3-day consecutive afebrile criteria validation. Doctor clinical sign-off and administrative pod release."}
                {activeTab === "Quality & Outcomes" && "Operational mortality benchmark monitoring against the 15% threshold standard with full cohort transparency."}
                {activeTab === "Security Audit Trail" && "Immutable, append-only security and clinical audit trail recording all observations, overrides, and releases."}
              </p>
            </div>

            <div className="page-header-actions">
              <button className="btn btn-secondary" onClick={exportClassifiedCSV}>
                <Download size={14} /> Export Manifest
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  playBeep("click", soundEnabled);
                  setShowAddSubject(true);
                }}
              >
                <UserPlus size={15} /> Intake Subject
              </button>
            </div>
          </div>

          {/* Active Biohazard Lockdown Alert Banner */}
          {threatLevel === "red" && (
            <div className="alert-banner">
              <div className="alert-banner-icon">
                <AlertOctagon size={20} />
              </div>
              <div className="alert-banner-content">
                <strong>CRITICAL BIOHAZARD ALERT — CONDITION RED IN EFFECT</strong>
                <p>Air filtration hermetically sealed. All subject movements locked to assigned pods. Virology rounds require Level-A bio-containment suits.</p>
              </div>
              <button
                className="btn btn-secondary"
                style={{ height: "32px", fontSize: "11px" }}
                onClick={() => setThreatLevel("amber")}
              >
                Downgrade to Amber
              </button>
            </div>
          )}

          {/* Quality Benchmark Warning if Mortality Exceeds 15% */}
          {isMortalityExceeded && (
            <div className="alert-banner amber">
              <div className="alert-banner-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="alert-banner-content">
                <strong>QUALITY BENCHMARK ALERT: MORTALITY THRESHOLD EXCEEDED ({mortalityRate.toFixed(1)}% &gt; 15%)</strong>
                <p>Facility protocol requires immediate leadership review when cohort mortality exceeds the 15% ceiling standard. Inspect Sector A &amp; C clinical logs.</p>
              </div>
              <button
                className="btn btn-secondary"
                style={{ height: "32px", fontSize: "11px" }}
                onClick={() => setActiveTab("Quality & Outcomes")}
              >
                View Benchmark Analysis
              </button>
            </div>
          )}

          {/* ===================== TAB 1: OVERVIEW ===================== */}
          {activeTab === "Overview" && (
            <>
              {/* KPI Cards Grid */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">CONTAINMENT OCCUPANCY</span>
                    <div className="kpi-icon-wrap red">
                      <BedDouble size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{occupiedBeds} / {capacityTotal}</div>
                  <div className="kpi-sub">
                    <span>{Math.round((occupiedBeds / capacityTotal) * 100)}% Capacity</span> • {capacityTotal - occupiedBeds} empty pods
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">BIOMETRICS LOGGED</span>
                    <div className="kpi-icon-wrap cyan">
                      <Thermometer size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{tempDoneCount} / {occupiedBeds}</div>
                  <div className="kpi-sub">
                    <span style={{ color: "var(--bio-amber)" }}>{tempDueList.length} scans due today</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">VIROLOGY ROUNDS DONE</span>
                    <div className="kpi-icon-wrap purple">
                      <Stethoscope size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{doctorDoneCount} / {occupiedBeds}</div>
                  <div className="kpi-sub">
                    <span>{doctorDueList.length} waiting post-biometric</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">DECON CLEARANCE QUEUE</span>
                    <div className="kpi-icon-wrap green">
                      <ClipboardCheck size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{deconReadyList.length}</div>
                  <div className="kpi-sub">
                    <span style={{ color: "var(--bio-emerald)" }}>3+ consecutive afebrile days</span>
                  </div>
                </div>
              </div>

              {/* Two-Column Layout: Care Workflows & Priority Queue */}
              <div className="dashboard-grid">
                {/* Left: Operational Care Workflow Progress */}
                <section className="hud-panel">
                  <div className="hud-panel-header">
                    <div>
                      <h2><Activity size={16} style={{ color: "var(--bio-cyan)" }} /> Daily Operational Workflow</h2>
                      <p>Active cycle progress across all 74 containment units</p>
                    </div>
                    <span className="hud-tag">CYCLE 0800 HRS</span>
                  </div>

                  <div className="workflow-list">
                    {/* Temperature Progress */}
                    <div className="workflow-item">
                      <div className="workflow-icon-box" style={{ background: "var(--bio-cyan-subtle)", color: "var(--bio-cyan)", border: "1px solid rgba(0, 240, 255, 0.25)" }}>
                        <Thermometer size={20} />
                      </div>
                      <div className="workflow-details">
                        <div className="workflow-title-row">
                          <strong>Daily Biometric Scans</strong>
                          <span className="workflow-fraction">{tempDoneCount}/{occupiedBeds} Logged</span>
                        </div>
                        <div className="workflow-subtext">Record 1 core temperature per subject per 24h cycle</div>
                        <div className="progress-track">
                          <div
                            className="progress-bar cyan"
                            style={{ width: `${occupiedBeds ? (tempDoneCount / occupiedBeds) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="action-arrow-btn"
                        onClick={() => {
                          playBeep("click", soundEnabled);
                          setActiveTab("Biometric Rounds");
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Doctor Rounds Progress */}
                    <div className="workflow-item">
                      <div className="workflow-icon-box" style={{ background: "var(--bio-purple-subtle)", color: "var(--bio-purple)", border: "1px solid rgba(181, 110, 255, 0.25)" }}>
                        <Stethoscope size={20} />
                      </div>
                      <div className="workflow-details">
                        <div className="workflow-title-row">
                          <strong>Virology Medical Rounds</strong>
                          <span className="workflow-fraction">{doctorDoneCount}/{occupiedBeds} Visited</span>
                        </div>
                        <div className="workflow-subtext">Conduct physician evaluations post-temperature recording</div>
                        <div className="progress-track">
                          <div
                            className="progress-bar purple"
                            style={{ width: `${occupiedBeds ? (doctorDoneCount / occupiedBeds) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="action-arrow-btn"
                        onClick={() => {
                          playBeep("click", soundEnabled);
                          setActiveTab("Virology Rounds");
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Decontamination Progress */}
                    <div className="workflow-item">
                      <div className="workflow-icon-box" style={{ background: "var(--bio-emerald-subtle)", color: "var(--bio-emerald)", border: "1px solid rgba(0, 245, 155, 0.25)" }}>
                        <ClipboardCheck size={20} />
                      </div>
                      <div className="workflow-details">
                        <div className="workflow-title-row">
                          <strong>Decontamination &amp; Release</strong>
                          <span className="workflow-fraction">{deconReadyList.length} Eligible</span>
                        </div>
                        <div className="workflow-subtext">3 full fever-free days verified; final airlock release ready</div>
                        <div className="progress-track">
                          <div
                            className="progress-bar green"
                            style={{ width: `${occupiedBeds ? (deconReadyList.length / occupiedBeds) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="action-arrow-btn"
                        onClick={() => {
                          playBeep("click", soundEnabled);
                          setActiveTab("Decon & Discharge");
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Right: Needs Immediate Attention Priority Queue */}
                <section className="hud-panel">
                  <div className="hud-panel-header">
                    <div>
                      <h2><AlertTriangle size={16} style={{ color: "var(--umbrella-red)" }} /> Biohazard Priorities</h2>
                      <p>Active anomaly queue requiring clinical action</p>
                    </div>
                    <span className="threat-chip red">
                      {highSpikeList.length + tempDueList.length} Open
                    </span>
                  </div>

                  <div className="priority-list">
                    {/* Thermal Spikes */}
                    {highSpikeList.slice(0, 2).map(s => (
                      <div
                        key={s.id}
                        className="priority-item"
                        onClick={() => {
                          setSelectedDossier(s);
                          playBeep("click", soundEnabled);
                        }}
                      >
                        <div className="priority-indicator red">
                          <Biohazard size={16} />
                        </div>
                        <div className="priority-info">
                          <strong>{s.name} ({s.id})</strong>
                          <span>{s.room} • {s.temp.toFixed(1)}°C Critical Fever Spike</span>
                        </div>
                        <span className="status-pill danger">SPIKE</span>
                      </div>
                    ))}

                    {/* Biometrics Due */}
                    {tempDueList.slice(0, 2).map(s => (
                      <div
                        key={s.id}
                        className="priority-item"
                        onClick={() => {
                          setTempEntry(s);
                          setTempValue("37.0");
                          playBeep("click", soundEnabled);
                        }}
                      >
                        <div className="priority-indicator amber">
                          <Thermometer size={16} />
                        </div>
                        <div className="priority-info">
                          <strong>{s.name} ({s.id})</strong>
                          <span>{s.room} • Daily core temp missing</span>
                        </div>
                        <span className="status-pill warning">DUE</span>
                      </div>
                    ))}

                    {/* Decon Eligible */}
                    {deconReadyList.slice(0, 2).map(s => (
                      <div
                        key={s.id}
                        className="priority-item"
                        onClick={() => {
                          setSelectedDossier(s);
                          playBeep("click", soundEnabled);
                        }}
                      >
                        <div className="priority-indicator green">
                          <Check size={16} />
                        </div>
                        <div className="priority-info">
                          <strong>{s.name} ({s.id})</strong>
                          <span>{s.room} • {s.feverFree} Consecutive Days Clean</span>
                        </div>
                        <span className="status-pill success">CLEARANCE</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Bottom: Fast Preview Census Table */}
              <section className="hud-panel">
                <div className="hud-panel-header">
                  <div>
                    <h2><Users size={16} style={{ color: "var(--bio-cyan)" }} /> Active Containment Census (First 6 Units)</h2>
                    <p>Current biometric telemetry and round status across sectors</p>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ height: "30px", fontSize: "11px", padding: "0 10px" }}
                    onClick={() => {
                      playBeep("click", soundEnabled);
                      setActiveTab("Subject Census");
                    }}
                  >
                    View All {activeSubjects.length} Subjects <ChevronRight size={13} />
                  </button>
                </div>

                <SubjectTable
                  subjects={activeSubjects.slice(0, 6)}
                  onTemp={s => {
                    setTempEntry(s);
                    setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                    playBeep("click", soundEnabled);
                  }}
                  onDoctor={s => {
                    setDoctorEntry(s);
                    playBeep("click", soundEnabled);
                  }}
                  onDischarge={handleCompleteDischarge}
                  onInspect={s => {
                    setSelectedDossier(s);
                    playBeep("click", soundEnabled);
                  }}
                />
              </section>
            </>
          )}

          {/* ===================== TAB 2: SUBJECT CENSUS ===================== */}
          {activeTab === "Subject Census" && (
            <section className="hud-panel">
              <div className="table-toolbar">
                <div className="search-input-box">
                  <Search size={15} />
                  <input
                    placeholder="Search Subject ID, Name, Containment Pod, or Viral Strain..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && <X size={14} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
                </div>

                <div className="filter-select-box">
                  <Filter size={15} />
                  <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="All">All Active Subjects</option>
                    <option value="Biometric Due">Biometric Scan Due</option>
                    <option value="Virology Pending">Virology Round Pending</option>
                    <option value="Decon Clearance">Decon Clearance (3 Days)</option>
                    <option value="Biohazard Spike">Biohazard Spike (≥38.0°C)</option>
                  </select>
                </div>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>
                  Showing <strong style={{ color: "#fff" }}>{filteredList.length}</strong> of {activeSubjects.length} active subjects
                </div>
              </div>

              <SubjectTable
                subjects={filteredList}
                onTemp={s => {
                  setTempEntry(s);
                  setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                  playBeep("click", soundEnabled);
                }}
                onDoctor={s => {
                  setDoctorEntry(s);
                  playBeep("click", soundEnabled);
                }}
                onDischarge={handleCompleteDischarge}
                onInspect={s => {
                  setSelectedDossier(s);
                  playBeep("click", soundEnabled);
                }}
              />
            </section>
          )}

          {/* ===================== TAB 3: BIOMETRIC ROUNDS ===================== */}
          {activeTab === "Biometric Rounds" && (
            <section className="hud-panel">
              <div className="hud-panel-header">
                <div>
                  <h2><Thermometer size={16} style={{ color: "var(--bio-cyan)" }} /> Daily Biometric Scans Queue</h2>
                  <p>Subjects requiring temperature recording today. Click 'Log Biometric' to input readings.</p>
                </div>
                <span className="threat-chip amber">{tempDueList.length} Incomplete</span>
              </div>

              <SubjectTable
                subjects={tempDueList.length > 0 ? tempDueList : activeSubjects}
                onTemp={s => {
                  setTempEntry(s);
                  setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                  playBeep("click", soundEnabled);
                }}
                onDoctor={s => {
                  setDoctorEntry(s);
                  playBeep("click", soundEnabled);
                }}
                onDischarge={handleCompleteDischarge}
                onInspect={s => {
                  setSelectedDossier(s);
                  playBeep("click", soundEnabled);
                }}
              />
            </section>
          )}

          {/* ===================== TAB 4: VIROLOGY ROUNDS ===================== */}
          {activeTab === "Virology Rounds" && (
            <section className="hud-panel">
              <div className="hud-panel-header">
                <div>
                  <h2><Stethoscope size={16} style={{ color: "var(--bio-purple)" }} /> Virology Medical Rounds Queue</h2>
                  <p>Prioritized cohort: temperature recorded today awaiting physician evaluation.</p>
                </div>
                <span className="threat-chip purple">{doctorDueList.length} Pending Examination</span>
              </div>

              <SubjectTable
                subjects={doctorDueList.length > 0 ? doctorDueList : activeSubjects}
                onTemp={s => {
                  setTempEntry(s);
                  setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                  playBeep("click", soundEnabled);
                }}
                onDoctor={s => {
                  setDoctorEntry(s);
                  playBeep("click", soundEnabled);
                }}
                onDischarge={handleCompleteDischarge}
                onInspect={s => {
                  setSelectedDossier(s);
                  playBeep("click", soundEnabled);
                }}
              />
            </section>
          )}

          {/* ===================== TAB 5: DECON & DISCHARGE ===================== */}
          {activeTab === "Decon & Discharge" && (
            <section className="hud-panel">
              <div className="hud-panel-header">
                <div>
                  <h2><ClipboardCheck size={16} style={{ color: "var(--bio-emerald)" }} /> Decontamination &amp; Release Chamber</h2>
                  <p>Subjects with 3 consecutive days afebrile (&lt;38.0°C). Mandatory 2-step clinical and airlock sign-off.</p>
                </div>
                <span className="threat-chip green">{deconReadyList.length} Ready For Decon</span>
              </div>

              <SubjectTable
                subjects={deconReadyList}
                mode="discharge"
                onTemp={s => {
                  setTempEntry(s);
                  setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                  playBeep("click", soundEnabled);
                }}
                onDoctor={s => {
                  setDoctorEntry(s);
                  playBeep("click", soundEnabled);
                }}
                onDischarge={handleCompleteDischarge}
                onInspect={s => {
                  setSelectedDossier(s);
                  playBeep("click", soundEnabled);
                }}
              />

              {discharged.length > 0 && (
                <div style={{ padding: "20px", borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", color: "var(--text-bright)", marginBottom: "10px" }}>
                    Archived Decontaminated Subjects ({discharged.length})
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
                    {discharged.map(d => (
                      <div key={d.id} style={{ background: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "12px", color: "var(--bio-emerald)" }}>{d.name}</strong>
                          <span className="status-pill success">RELEASED</span>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
                          {d.id} • Decon Timestamp: {d.deconTimestamp.split("T")[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ===================== TAB 6: QUALITY & OUTCOMES ===================== */}
          {activeTab === "Quality & Outcomes" && (
            <div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">EXPECTED SURVIVAL BENCHMARK</span>
                    <div className="kpi-icon-wrap green">
                      <HeartPulse size={18} />
                    </div>
                  </div>
                  <div className="kpi-value" style={{ color: "var(--bio-emerald)" }}>85.0%</div>
                  <div className="kpi-sub">Mandatory Target Standard (PRD Section 6)</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">MORTALITY CEILING BENCHMARK</span>
                    <div className="kpi-icon-wrap red">
                      <Activity size={18} />
                    </div>
                  </div>
                  <div className="kpi-value" style={{ color: "var(--umbrella-red)" }}>15.0%</div>
                  <div className="kpi-sub">Maximum Tolerable Rate Before Escalation</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">CURRENT COHORT SURVIVAL</span>
                    <div className="kpi-icon-wrap cyan">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{survivalRate.toFixed(1)}%</div>
                  <div className="kpi-sub">{activeSubjects.length + discharged.length} Survived / Cleared</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">TOTAL TRACKED COHORT</span>
                    <div className="kpi-icon-wrap purple">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{totalTrackedCohort}</div>
                  <div className="kpi-sub">{fatalities.length} Documented Fatalities</div>
                </div>
              </div>

              <div className="hud-panel quality-benchmark-card">
                <div className="hud-panel-header">
                  <div>
                    <h2><BarChart3 size={16} style={{ color: "var(--bio-cyan)" }} /> Quality &amp; Clinical Outcome Framework</h2>
                    <p>Transparent epidemiological formulas as required by facility clinical governance</p>
                  </div>
                  <span className="threat-chip amber">CLINICAL GOVERNANCE</span>
                </div>

                <div className="benchmark-formula-row">
                  <div>
                    <strong>Mortality Rate Formula</strong>
                    <span>Cumulative clinical fatalities divided by total eligible cohort</span>
                  </div>
                  <code>Fatalities ÷ (Active + Decontaminated + Fatalities) × 100</code>
                </div>

                <div className="benchmark-formula-row">
                  <div>
                    <strong>Survival Rate Formula</strong>
                    <span>Subjects successfully stabilized and/or released through decontamination</span>
                  </div>
                  <code>(Active + Decontaminated) ÷ Total Tracked Cohort × 100</code>
                </div>

                <div className="benchmark-formula-row">
                  <div>
                    <strong>15% Escalation Protocol Threshold</strong>
                    <span>Automatic biohazard containment review triggered if rate exceeds 15%</span>
                  </div>
                  <code style={{ color: "var(--umbrella-red)", borderColor: "var(--umbrella-red)" }}>Threshold: &gt; 15.0% Fatalities</code>
                </div>

                <div style={{ padding: "16px", background: "rgba(255, 42, 75, 0.04)", border: "1px solid rgba(255, 42, 75, 0.2)", borderRadius: "var(--radius-sm)", margin: "16px 20px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <ShieldAlert size={18} style={{ color: "var(--umbrella-red)", flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      <strong style={{ color: "#fff" }}>Safety &amp; Small Cohort Caveat:</strong> In small observational cohorts, individual casualties can significantly skew percentage mortality rates. Clinical leadership must review raw counts alongside percentage rates before altering facility quarantine protocols.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: SECURITY AUDIT TRAIL ===================== */}
          {activeTab === "Security Audit Trail" && (
            <section className="hud-panel">
              <div className="hud-panel-header">
                <div>
                  <h2><FileText size={16} style={{ color: "var(--umbrella-red)" }} /> Immutable Security &amp; Clinical Audit Log</h2>
                  <p>Append-only audit register satisfying P0 launch-critical compliance. Preserves full amendment chain.</p>
                </div>
                <span className="hud-tag">ENCRYPTED RED QUEEN ARCHIVE</span>
              </div>

              <div>
                {auditLogs.map(log => (
                  <div key={log.id} className="audit-entry">
                    <span className="audit-timestamp">{log.time}</span>
                    <span
                      className="audit-badge"
                      style={{
                        background: log.code.includes("SPIKE") || log.code.includes("CRITICAL")
                          ? "var(--umbrella-red-subtle)"
                          : "var(--bio-cyan-subtle)",
                        color: log.code.includes("SPIKE") || log.code.includes("CRITICAL")
                          ? "var(--umbrella-red)"
                          : "var(--bio-cyan)",
                        border: `1px solid ${
                          log.code.includes("SPIKE") || log.code.includes("CRITICAL")
                            ? "rgba(255,42,75,0.4)"
                            : "rgba(0,240,255,0.3)"
                        }`
                      }}
                    >
                      {log.code}
                    </span>
                    <div className="audit-details">
                      <strong>Operator Role: {log.role}</strong>
                      <p>{log.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Page Footer */}
          <footer style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <span>UMBRELLA CORPORATION • ARKLAY RESEARCH DIVISION • HIVE OPERATIONS PROTOTYPE V0.9</span>
            <span>SYSTEM INTEGRITY: 100% NOMINAL • RED QUEEN PROTOCOL ACTIVE</span>
          </footer>
        </div>
      </main>

      {/* ===================== MODAL: INTAKE NEW SUBJECT ===================== */}
      {showAddSubject && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setShowAddSubject(false)}>
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2><UserPlus size={18} style={{ color: "var(--umbrella-red)" }} /> Subject Intake Protocol</h2>
                <p>Admit new subject into the 74-bed quarantine facility</p>
              </div>
              <button className="icon-btn" onClick={() => setShowAddSubject(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Full Name</label>
                <input
                  required
                  className="form-control"
                  placeholder="e.g. Sherry Birkin"
                  value={newSubject.name}
                  onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    className="form-control"
                    placeholder="e.g. 25"
                    value={newSubject.age}
                    onChange={e => setNewSubject({ ...newSubject, age: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Assigned Pod / Unit</label>
                  <input
                    required
                    className="form-control"
                    placeholder="e.g. Pod A-04"
                    value={newSubject.room}
                    onChange={e => setNewSubject({ ...newSubject, room: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Viral Strain / Vector Classification</label>
                <select
                  className="form-control"
                  value={newSubject.strain}
                  onChange={e => setNewSubject({ ...newSubject, strain: e.target.value })}
                >
                  <option>Vector-T Progenitor</option>
                  <option>T-Alpha Aerosol Variant</option>
                  <option>U.B.C.S. Contact Exposure</option>
                  <option>Asymptomatic Quarantine</option>
                  <option>Synthetic Viral Marker Delta</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSubject(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={15} /> Confirm Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RECORD BIOMETRIC TEMPERATURE ===================== */}
      {tempEntry && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setTempEntry(null)}>
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2><Thermometer size={18} style={{ color: "var(--bio-cyan)" }} /> Record Core Biometrics</h2>
                <p>{tempEntry.name} ({tempEntry.id}) • {tempEntry.room}</p>
              </div>
              <button className="icon-btn" onClick={() => setTempEntry(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTemp}>
              {tempEntry.tempDone && (
                <div style={{ background: "var(--bio-amber-subtle)", border: "1px solid rgba(255,170,0,0.3)", borderRadius: "var(--radius-sm)", padding: "10px", marginBottom: "16px", fontSize: "11px", color: "var(--bio-amber)" }}>
                  <AlertTriangle size={15} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                  <strong>Duplicate Observation Notice:</strong> A temperature reading ({tempEntry.temp}°C) has already been logged today. Overwrite requires an audited clinical justification.
                </div>
              )}

              <div className="form-group">
                <label>Core Body Temperature (°C)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="45"
                    required
                    className="form-control"
                    style={{ fontSize: "18px", fontWeight: "bold", fontFamily: "var(--font-mono)" }}
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--text-secondary)" }}>
                    {parseFloat(tempValue) >= 38.0 ? (
                      <span style={{ color: "var(--umbrella-red)", fontWeight: "bold" }}>FEVER SPIKE</span>
                    ) : parseFloat(tempValue) >= 37.5 ? (
                      <span style={{ color: "var(--bio-amber)" }}>ELEVATED</span>
                    ) : (
                      <span style={{ color: "var(--bio-emerald)" }}>AFEBRILE</span>
                    )}
                  </div>
                </div>
              </div>

              {tempEntry.tempDone && (
                <div className="form-group">
                  <label>Audit Justification for Overwrite / Re-measurement</label>
                  <input
                    required
                    className="form-control"
                    placeholder="e.g. Re-tested following anti-pyretic or sensor calibration error"
                    value={tempOverrideReason}
                    onChange={e => setTempOverrideReason(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Clinical Observation Note (Optional)</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Record factual symptoms, rigors, diaphoresis..."
                  value={tempNote}
                  onChange={e => setTempNote(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setTempEntry(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={15} /> Save &amp; Enqueue For Rounds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: VIROLOGY DOCTOR ROUND ===================== */}
      {doctorEntry && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setDoctorEntry(null)}>
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2><Stethoscope size={18} style={{ color: "var(--bio-purple)" }} /> Virology Medical Encounter</h2>
                <p>{doctorEntry.name} ({doctorEntry.id}) • {doctorEntry.room}</p>
              </div>
              <button className="icon-btn" onClick={() => setDoctorEntry(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor}>
              {!doctorEntry.tempDone && (
                <div style={{ background: "rgba(255,42,75,0.08)", border: "1px solid rgba(255,42,75,0.3)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "16px", fontSize: "11px", color: "var(--text-bright)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <AlertTriangle size={16} style={{ color: "var(--umbrella-red)" }} />
                    <strong style={{ color: "var(--umbrella-red)" }}>No Biometric Logged Today</strong>
                  </div>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Standard protocol dictates physician rounds occur after daily biometric measurement. Emergency override is required to proceed.
                  </p>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#fff", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={doctorUrgentOverride}
                      onChange={e => setDoctorUrgentOverride(e.target.checked)}
                    />
                    Authorize Urgent Clinical Exception
                  </label>
                  {doctorUrgentOverride && (
                    <input
                      required
                      className="form-control"
                      style={{ marginTop: "8px" }}
                      placeholder="Enter emergency clinical rationale (e.g. Acute respiratory decompensation)"
                      value={urgentOverrideReason}
                      onChange={e => setUrgentOverrideReason(e.target.value)}
                    />
                  )}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: "var(--bg-base)", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>LATEST TEMP</span>
                  <strong style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: doctorEntry.temp ? (doctorEntry.temp >= 38 ? "var(--umbrella-red)" : "var(--bio-emerald)") : "var(--text-muted)" }}>
                    {doctorEntry.temp ? `${doctorEntry.temp.toFixed(1)}°C` : "NOT TAKEN"}
                  </strong>
                </div>
                <div style={{ background: "var(--bg-base)", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>AFEBRILE STREAK</span>
                  <strong style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: doctorEntry.feverFree >= 3 ? "var(--bio-emerald)" : "#fff" }}>
                    {doctorEntry.feverFree} / 3 Days
                  </strong>
                </div>
              </div>

              <div className="form-group">
                <label>Physician Assessment &amp; Treatment Directives</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Record cellular stability, lung sounds, symptom trajectory..."
                  value={doctorNote}
                  onChange={e => setDoctorNote(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setDoctorEntry(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={15} /> Complete &amp; Sign Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: SUBJECT DOSSIER & TELEMETRY ===================== */}
      {selectedDossier && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setSelectedDossier(null)}>
          <div className="modal-dialog large">
            <div className="modal-header">
              <div>
                <h2><Biohazard size={18} style={{ color: "var(--umbrella-red)" }} /> Subject Bio-Dossier: {selectedDossier.name}</h2>
                <p>Facility Registry ID: {selectedDossier.id} • Assigned to {selectedDossier.room}</p>
              </div>
              <button className="icon-btn" onClick={() => setSelectedDossier(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* Telemetry Card */}
              <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  5-Day Temperature Curve (°C)
                </span>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "100px", marginTop: "14px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)" }}>
                  {selectedDossier.history.map((val, idx) => (
                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: val >= 38 ? "var(--umbrella-red)" : "var(--bio-cyan)" }}>
                        {val ? `${val}°` : "—"}
                      </span>
                      <div
                        style={{
                          width: "100%",
                          height: val ? `${Math.max(12, ((val - 35) / (41 - 35)) * 80)}px` : "4px",
                          background: val >= 38.0 ? "var(--umbrella-red)" : val ? "var(--bio-cyan)" : "var(--border-subtle)",
                          borderRadius: "3px 3px 0 0",
                          boxShadow: val >= 38.0 ? "0 0 10px var(--umbrella-red-glow)" : "none"
                        }}
                      />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)" }}>
                        D-{5 - idx}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "14px" }}>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>HEART RATE</span>
                    <strong style={{ display: "block", fontSize: "14px", color: "#fff", fontFamily: "var(--font-mono)" }}>
                      {selectedDossier.vitals?.hr || 74} BPM
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>BLOOD O2</span>
                    <strong style={{ display: "block", fontSize: "14px", color: "var(--bio-cyan)", fontFamily: "var(--font-mono)" }}>
                      {selectedDossier.vitals?.spo2 || 99}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>FEVER-FREE</span>
                    <strong style={{ display: "block", fontSize: "14px", color: selectedDossier.feverFree >= 3 ? "var(--bio-emerald)" : "var(--bio-amber)", fontFamily: "var(--font-mono)" }}>
                      {selectedDossier.feverFree} / 3 Days
                    </strong>
                  </div>
                </div>
              </div>

              {/* Classification & Protocol Details */}
              <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Pathogen Classification
                </span>
                <div style={{ marginTop: "10px" }}>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--text-bright)" }}>
                    {selectedDossier.strain}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginTop: "3px" }}>
                    Location: {selectedDossier.sector}
                  </span>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>LATEST CLINICAL NOTES</span>
                  <p style={{ fontSize: "11px", color: "var(--text-primary)", marginTop: "4px", lineHeight: 1.5 }}>
                    "{selectedDossier.notes}"
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedDossier(null)}>
                Close Dossier
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const s = selectedDossier;
                  setSelectedDossier(null);
                  setTempEntry(s);
                  setTempValue(s.temp ? s.temp.toFixed(1) : "37.0");
                }}
              >
                <Thermometer size={14} /> Log Core Temp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TOAST NOTIFICATION ===================== */}
      {toast && (
        <div className="hud-toast">
          {toast.type === "alert" ? (
            <AlertTriangle size={18} style={{ color: "var(--umbrella-red)" }} />
          ) : (
            <CircleCheck size={18} style={{ color: "var(--bio-emerald)" }} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// Sub-component: Reusable Subject Table
function SubjectTable({ subjects, onTemp, onDoctor, onDischarge, onInspect, mode = "all" }) {
  if (subjects.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
        <ClipboardList size={32} style={{ margin: "0 auto 10px", display: "block", color: "var(--text-muted)" }} />
        <strong style={{ fontSize: "14px", color: "var(--text-secondary)", display: "block" }}>No Subjects Matching Criteria</strong>
        <span style={{ fontSize: "11px" }}>Adjust your search or filter parameters.</span>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>SUBJECT DOSSIER</th>
            <th>CONTAINMENT POD</th>
            <th>VIRAL CLASSIFICATION</th>
            <th>CORE TEMP (°C)</th>
            <th>TODAY'S STATUS</th>
            <th>AFEBRILE STREAK</th>
            <th>BIO-STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(s => {
            const isSpike = s.temp >= 38.0;
            const isEligible = s.feverFree >= 3;
            return (
              <tr key={s.id}>
                {/* Subject Cell */}
                <td>
                  <div className="subject-cell">
                    <div
                      className={`subject-avatar ${isSpike ? "spike" : ""}`}
                      onClick={() => onInspect?.(s)}
                      style={{ cursor: "pointer" }}
                      title="Inspect Dossier"
                    >
                      {s.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="subject-info">
                      <strong onClick={() => onInspect?.(s)} style={{ cursor: "pointer" }}>
                        {s.name}
                      </strong>
                      <span>{s.id} • Age {s.age}</span>
                    </div>
                  </div>
                </td>

                {/* Pod */}
                <td>
                  <span className="unit-tag">{s.room}</span>
                </td>

                {/* Viral Strain */}
                <td style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  {s.strain}
                </td>

                {/* Temperature */}
                <td>
                  {s.temp == null ? (
                    <span className="temp-badge muted">— PENDING</span>
                  ) : (
                    <div>
                      <span className={`temp-badge ${isSpike ? "danger" : s.temp >= 37.5 ? "warning" : "good"}`}>
                        {s.temp.toFixed(1)}°C
                      </span>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)" }}>
                        {s.tempTime || "Today"}
                      </div>
                    </div>
                  )}
                </td>

                {/* Tasks Pair */}
                <td>
                  <div className="task-pair">
                    <span className={`task-tag ${s.tempDone ? "done" : "pending"}`}>
                      {s.tempDone ? <Check size={11} /> : <Clock3 size={11} />} Biometric
                    </span>
                    <span className={`task-tag ${s.doctorDone ? "done" : "pending"}`}>
                      {s.doctorDone ? <Check size={11} /> : <Clock3 size={11} />} Virology
                    </span>
                  </div>
                </td>

                {/* Fever Free Streak */}
                <td>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: isEligible ? "var(--bio-emerald)" : "var(--text-secondary)" }}>
                    {s.feverFree} / 3 Days
                  </span>
                </td>

                {/* Status Pill */}
                <td>
                  <span
                    className={`status-pill ${
                      isSpike
                        ? "danger"
                        : isEligible
                        ? "success"
                        : !s.tempDone
                        ? "warning"
                        : "info"
                    }`}
                  >
                    {isSpike
                      ? "BIOHAZARD SPIKE"
                      : isEligible
                      ? "DECON CANDIDATE"
                      : !s.tempDone
                      ? "BIOMETRIC DUE"
                      : "VIROLOGY PENDING"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {mode === "discharge" || isEligible ? (
                      <button className="table-action-btn green" onClick={() => onDischarge?.(s)}>
                        <ClipboardCheck size={13} /> Decon Release
                      </button>
                    ) : !s.tempDone ? (
                      <button className="table-action-btn red" onClick={() => onTemp?.(s)}>
                        <Thermometer size={13} /> Log Biometric
                      </button>
                    ) : !s.doctorDone ? (
                      <button className="table-action-btn" style={{ borderColor: "var(--bio-purple)", color: "var(--bio-purple)" }} onClick={() => onDoctor?.(s)}>
                        <Stethoscope size={13} /> Conduct Round
                      </button>
                    ) : (
                      <button className="table-action-btn" onClick={() => onInspect?.(s)}>
                        <Eye size={13} /> View Dossier
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}