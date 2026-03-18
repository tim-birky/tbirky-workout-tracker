import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const STORAGE_KEY = "tbirky-workout-tracker-v1";

const createSets = (targets, suggested = []) =>
  targets.map((target, i) => ({ target, weight: suggested[i] || "", reps: "", done: false }));

const PLAN = [
  {
    key: "mon",
    label: "Monday",
    date: "March 16",
    subtitle: "Upper Body",
    warmup: ["Standard upper-body warmup", "Focus on form for barbell rows"],
    finisher: "Incline treadmill: 10 minutes",
    exercises: [
      { name: "Barbell Bench Press", notes: "Suggested: 180 / 185 / 190.", sets: createSets(["10-12","10-12","10-12"],["180","185","190"]) },
      { name: "Pec Fly Machine", notes: "Suggested: 135 / 140 / 145. If unavailable, do DB Pec Fly.", sets: createSets(["10-12","10-12","10-12"],["135","140","145"]) },
      { name: "Barbell Rows", notes: "Suggested: 135 / 145 / 145.", sets: createSets(["10-12","10-12","10-12"],["135","145","145"]) },
      { name: "DB Shoulder Press", notes: "Suggested: 50 / 50 / 55.", sets: createSets(["10-12","10-12","10-12"],["50","50","55"]) },
      { name: "DB Biceps Hammer Curls", notes: "Suggested: 40 / 40 / 45.", sets: createSets(["10-12","10-12","10-12"],["40","40","45"]) },
      { name: "ISO Lateral Incline Press", notes: "Suggested: 75 / 80 / 80 each side.", sets: createSets(["10-12","10-12","10-12"],["75","80","80"]) },
    ]
  },
  {
    key: "tue",
    label: "Tuesday",
    date: "March 17",
    subtitle: "Lower Body",
    warmup: ["Stretch lower body or foam roll legs/glutes"],
    finisher: "Stair Stepper: 10 minutes at 8 speed",
    exercises: [
      { name: "Leg Curl Machine", notes: "Suggested: 130 / 140 / 150. Other machine: 120 / 125 / 130.", sets: createSets(["10-12","10-12","10-12"],["130","140","150"]) },
      { name: "Leg Press Machine", notes: "Suggested: 360 / 370 / 380.", sets: createSets(["10-12","10-12","10-12"],["360","370","380"]) },
      { name: "Hip Abduction Machine", notes: "Suggested: 140 / 145 / 150.", sets: createSets(["10-12","10-12","10-12"],["140","145","150"]) },
      { name: "Hip Adduction Machine", notes: "Suggested: 135 / 140 / 145.", sets: createSets(["10-12","10-12","10-12"],["135","140","145"]) },
      { name: "Leg Extension Machine", notes: "Suggested: 190 / 195 / 200.", sets: createSets(["10-12","10-12","10-12"],["190","195","200"]) },
      { name: "Bench Barbell Hip Thrust Machine", notes: "Suggested: 260 / 270 / 280.", sets: createSets(["10-12","10-12","10-12"],["260","270","280"]) },
    ]
  },
  {
    key: "thu",
    label: "Thursday",
    date: "March 19",
    subtitle: "Push",
    warmup: ["Standard upper-body warmup", "Shoulders and triceps prep"],
    finisher: "Core circuit: Leg Raises 3x25, Heel Touches 3x40, Half Wipers 3x20",
    exercises: [
      { name: "DB Bench Press", notes: "Suggested: 80 / 80 / 85.", sets: createSets(["10-12","10-12","10-12"],["80","80","85"]) },
      { name: "Incline DB Bench Press", notes: "Suggested: 60 / 65 / 70.", sets: createSets(["10-12","10-12","10-12"],["60","65","70"]) },
      { name: "Curl Bar Skullcrushers", notes: "Suggested: 70 / 75 / 80.", sets: createSets(["10-12","10-12","10-12"],["70","75","80"]) },
      { name: "Overhead Cable Triceps Extension - Rope Attachment", notes: "Suggested: 110 / 115 / 120.", sets: createSets(["10-12","10-12","10-12"],["110","115","120"]) },
      { name: "Cable Lateral Raise", notes: "Suggested: 25 / 25 / 30. Heavier may turn into traps/shrugging.", sets: createSets(["10-12","10-12","10-12"],["25","25","30"]) },
      { name: "Landmine Chest Press", notes: "Suggested: 90 / 95 / 100 plates.", sets: createSets(["10-12","10-12","10-12"],["90","95","100"]) },
    ]
  },
  {
    key: "fri",
    label: "Friday",
    date: "March 20",
    subtitle: "Pull",
    warmup: ["Standard pull warmup", "Focus on preacher curl tempo"],
    finisher: "Rowing Machine: 10 minutes",
    exercises: [
      { name: "Close Grip Lat Pulldown", notes: "Suggested: 140 / 145 / 150.", sets: createSets(["10-12","10-12","10-12"],["140","145","150"]) },
      { name: "ISO Row Machine - Close Grip Variation", notes: "Suggested: 170 / 180 / 190.", sets: createSets(["10-12","10-12","10-12"],["170","180","190"]) },
      { name: "Preacher Curls", notes: "Suggested: 60 / 65 / 70. 2 sec down, 1 sec up.", sets: createSets(["10-12","10-12","10-12"],["60","65","70"]) },
      { name: "Wide Grip Low Row", notes: "Suggested: 130 / 140 / 150.", sets: createSets(["10-12","10-12","10-12"],["130","140","150"]) },
      { name: "Seated Incline DB Curls", notes: "Suggested: 35 / 35 / 40 alternating.", sets: createSets(["10-12","10-12","10-12"],["35","35","40"]) },
      { name: "Cable Single Arm Curls", notes: "Suggested: 40 / 45 / 50. Try to get 10 without using shoulders.", sets: createSets(["10-12","10-12","10-12"],["40","45","50"]) },
    ]
  },
  {
    key: "sat",
    label: "Saturday",
    date: "March 21",
    subtitle: "Full Body",
    warmup: ["Standard full-body warmup"],
    finisher: "Core finisher: Plank 3x45-60 sec, Bicycles 3x30, Crunches 3x10-15",
    exercises: [
      { name: "SS - Medicine Ball Push-ups", notes: "Smallish med ball. 3 sets of 10 each side.", sets: createSets(["10 each side","10 each side","10 each side"],["BW","BW","BW"]) },
      { name: "SS - BW Squats", notes: "Bodyweight only.", sets: createSets(["30","30","30"],["BW","BW","BW"]) },
      { name: "SS - DB Curls to Press", notes: "Suggested: 35 lbs.", sets: createSets(["10-15","10-15","10-15"],["35","35","35"]) },
      { name: "Seated Reverse Flyes", notes: "Suggested: 50 / 55 / 60. Could go higher but don't shrug.", sets: createSets(["10-12","10-12","10-12"],["50","55","60"]) },
      { name: "Decline Bench Press", notes: "Suggested: 55 / 60 / 65 each side.", sets: createSets(["10-12","10-12","10-12"],["55","60","65"]) },
    ]
  }
];

function emptyLogForDay(day) {
  return {
    bodyweight: "",
    completionTime: "",
    sleep: "",
    energy: "",
    preWorkoutFood: "",
    hydration: "",
    comments: "",
    sets: Object.fromEntries(day.exercises.map((ex) => [ex.name, ex.sets.map((s) => ({ ...s }))])),
    exerciseNotes: Object.fromEntries(day.exercises.map((ex) => [ex.name, ""])),
    workoutImage: "",
    finisherDone: false,
    finisherActual: "",
  };
}

function initialState() {
  return {
    weekLabel: "Week 94",
    checkIn: {
      currentWeight: "214.7",
      goalWeight: "200",
      medication: "Compounded tirzepatide",
      notes: "Keep lunges, deadlifts, and squats minimal. Prefer machine-based and stable lifts.",
    },
    logs: Object.fromEntries(PLAN.map((day) => [day.key, emptyLogForDay(day)])),
  };
}

function copyText(text) {
  navigator.clipboard.writeText(text);
}

function SectionCard({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

export default function App() {
  const [state, setState] = useState(initialState);
  const [activeTab, setActiveTab] = useState(PLAN[0].key);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw));
        setLastSaved("Loaded saved data from this browser");
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setLastSaved(`Auto-saved on this device at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
  }, [state]);

  const totalSets = useMemo(
    () => PLAN.reduce((sum, day) => sum + day.exercises.reduce((s, ex) => s + ex.sets.length, 0), 0),
    []
  );

  const completedSets = useMemo(
    () =>
      PLAN.reduce((sum, day) => {
        const dayLog = state.logs[day.key];
        return sum + Object.values(dayLog.sets).reduce((inner, sets) => inner + sets.filter((s) => s.done).length, 0);
      }, 0),
    [state.logs]
  );

  const progress = Math.round((completedSets / totalSets) * 100);

  const updateDayField = (dayKey, field, value) => {
    setState((prev) => ({
      ...prev,
      logs: { ...prev.logs, [dayKey]: { ...prev.logs[dayKey], [field]: value } },
    }));
  };

  const updateSet = (dayKey, exerciseName, index, field, value) => {
    setState((prev) => {
      const sets = [...prev.logs[dayKey].sets[exerciseName]];
      sets[index] = { ...sets[index], [field]: value };
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dayKey]: {
            ...prev.logs[dayKey],
            sets: { ...prev.logs[dayKey].sets, [exerciseName]: sets },
          },
        },
      };
    });
  };

  const updateExerciseNote = (dayKey, exerciseName, value) => {
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dayKey]: {
          ...prev.logs[dayKey],
          exerciseNotes: { ...prev.logs[dayKey].exerciseNotes, [exerciseName]: value },
        },
      },
    }));
  };

  const resetAll = () => {
    const fresh = initialState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  const importBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setState(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        setLastSaved("Backup imported successfully");
      } catch {
        setLastSaved("Import failed: invalid backup file");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const exportPayload = useMemo(() => JSON.stringify(state, null, 2), [state]);

  const shareSummary = useMemo(() => {
    const lines = [];
    lines.push(`${state.weekLabel} workout tracker update`);
    lines.push(`Current weight: ${state.checkIn.currentWeight || "n/a"}`);
    lines.push(`Goal weight: ${state.checkIn.goalWeight || "n/a"}`);
    lines.push(`Medication: ${state.checkIn.medication || "n/a"}`);
    lines.push("");
    for (const day of PLAN) {
      const log = state.logs[day.key];
      lines.push(`${day.label} (${day.date}) - ${day.subtitle}`);
      if (log.completionTime) lines.push(`Completion time: ${log.completionTime}`);
      if (log.bodyweight) lines.push(`Bodyweight: ${log.bodyweight}`);
      if (log.sleep) lines.push(`Sleep: ${log.sleep}`);
      if (log.energy) lines.push(`Energy: ${log.energy}`);
      if (log.preWorkoutFood) lines.push(`Pre-workout food: ${log.preWorkoutFood}`);
      if (log.hydration) lines.push(`Hydration: ${log.hydration}`);
      for (const ex of day.exercises) {
        const doneSets = log.sets[ex.name]
          .map((s, i) => (s.done || s.weight || s.reps ? `Set ${i + 1}: ${s.weight || "-"} lbs x ${s.reps || "-"} reps` : null))
          .filter(Boolean);
        if (doneSets.length) lines.push(`${ex.name}: ${doneSets.join("; ")}`);
        if (log.exerciseNotes[ex.name]) lines.push(`${ex.name} notes: ${log.exerciseNotes[ex.name]}`);
      }
      lines.push(`Finisher done: ${log.finisherDone ? "Yes" : "No"}`);
      if (log.finisherActual) lines.push(`Finisher actual: ${log.finisherActual}`);
      if (log.comments) lines.push(`Comments: ${log.comments}`);
      lines.push("");
    }
    return lines.join("\n");
  }, [state]);

  const downloadBackup = () => {
    const blob = new Blob([exportPayload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.weekLabel.toLowerCase().replace(/\s+/g, "-")}-tracker.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
    setLastSaved("Backup download triggered");
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="top-grid">
          <SectionCard>
            <div className="card-pad">
              <h1 className="title">T.Birky Workout Tracker</h1>
              <p className="muted">Deployable version with no extra UI libraries required.</p>
              <div className="form-grid four">
                <Field label="Week">
                  <input value={state.weekLabel} onChange={(e) => setState((prev) => ({ ...prev, weekLabel: e.target.value }))} />
                </Field>
                <Field label="Current Weight">
                  <input value={state.checkIn.currentWeight} onChange={(e) => setState((prev) => ({ ...prev, checkIn: { ...prev.checkIn, currentWeight: e.target.value } }))} />
                </Field>
                <Field label="Goal Weight">
                  <input value={state.checkIn.goalWeight} onChange={(e) => setState((prev) => ({ ...prev, checkIn: { ...prev.checkIn, goalWeight: e.target.value } }))} />
                </Field>
                <Field label="Medication">
                  <input value={state.checkIn.medication} onChange={(e) => setState((prev) => ({ ...prev, checkIn: { ...prev.checkIn, medication: e.target.value } }))} />
                </Field>
              </div>
              <Field label="Weekly Notes">
                <textarea value={state.checkIn.notes} onChange={(e) => setState((prev) => ({ ...prev, checkIn: { ...prev.checkIn, notes: e.target.value } }))} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="card-pad">
              <h2 className="subtitle">Progress + Save</h2>
              <div className="progress-meta">
                <span>Completed Sets</span>
                <span>{completedSets}/{totalSets}</span>
              </div>
              <div className="progress-bar"><div style={{ width: `${progress}%` }} /></div>
              <div className="badge-row">
                <Badge>5 Day Split</Badge>
                <Badge>Week 94</Badge>
                <Badge>Local Save</Badge>
              </div>
              <div className="small muted" style={{ marginTop: 10 }}>{lastSaved || "Auto-saves in this browser only"}</div>
              <div className="action-grid">
                <button className="btn btn-primary" onClick={() => { copyText(shareSummary); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
                  {copied ? "Copied" : "Copy summary to paste back into chat"}
                </button>
                <button className="btn" onClick={() => copyText(exportPayload)}>Copy raw JSON</button>
                <button className="btn" onClick={downloadBackup}>Download backup file</button>
                <button className="btn" onClick={() => fileInputRef.current?.click()}>Import backup file</button>
                <input ref={fileInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={importBackup} />
                <button className="btn btn-danger" onClick={resetAll}>Reset week</button>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="tab-grid">
          {PLAN.map((day) => (
            <button key={day.key} className={`tab-btn ${activeTab === day.key ? "active" : ""}`} onClick={() => setActiveTab(day.key)}>
              <div>{day.label}</div>
              <div className="tiny muted">{day.date}</div>
            </button>
          ))}
        </div>

        {PLAN.map((day) => {
          const log = state.logs[day.key];
          if (day.key !== activeTab) return null;
          return (
            <SectionCard key={day.key}>
              <div className="card-pad day-space">
                <div className="day-header">
                  <h2 className="day-title">{day.label} ({day.date}): {day.subtitle}</h2>
                  <Badge>{Object.values(log.sets).flat().filter((s) => s.done).length} sets done</Badge>
                </div>

                <div className="form-grid six">
                  <Field label="Bodyweight"><input value={log.bodyweight} onChange={(e) => updateDayField(day.key, "bodyweight", e.target.value)} /></Field>
                  <Field label="Completion Time"><input value={log.completionTime} placeholder="2:45pm" onChange={(e) => updateDayField(day.key, "completionTime", e.target.value)} /></Field>
                  <Field label="Sleep"><input value={log.sleep} placeholder="7.5 hrs" onChange={(e) => updateDayField(day.key, "sleep", e.target.value)} /></Field>
                  <Field label="Energy"><input value={log.energy} placeholder="Good / Medium / Low" onChange={(e) => updateDayField(day.key, "energy", e.target.value)} /></Field>
                  <Field label="Pre-workout food"><input value={log.preWorkoutFood} onChange={(e) => updateDayField(day.key, "preWorkoutFood", e.target.value)} /></Field>
                  <Field label="Hydration"><input value={log.hydration} onChange={(e) => updateDayField(day.key, "hydration", e.target.value)} /></Field>
                </div>

                <SectionCard className="dashed">
                  <div className="card-pad">
                    <div className="section-label">Warmup</div>
                    <div className="badge-row">
                      {day.warmup.map((item) => <Badge key={item}>{item}</Badge>)}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard className="dashed">
                  <div className="card-pad">
                    <div className="section-label">Workout Image</div>
                    <div className="small muted">Upload your Apple Watch stats screenshot for this day.</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => updateDayField(day.key, "workoutImage", String(reader.result));
                        reader.readAsDataURL(file);
                      }}
                    />
                    {log.workoutImage ? (
                      <div className="image-wrap"><img src={log.workoutImage} alt={`${day.label} upload`} /></div>
                    ) : null}
                  </div>
                </SectionCard>

                <div className="accordion-list">
                  {day.exercises.map((exercise) => {
                    const sets = log.sets[exercise.name];
                    const doneCount = sets.filter((s) => s.done).length;
                    return (
                      <details key={exercise.name} className="exercise-box">
                        <summary>
                          <div>
                            <div className="exercise-title">{exercise.name}</div>
                            {exercise.notes ? <div className="small muted">{exercise.notes}</div> : null}
                          </div>
                          <Badge>{doneCount}/{sets.length}</Badge>
                        </summary>

                        <div className="exercise-content">
                          {sets.map((set, idx) => (
                            <div key={idx} className="set-box">
                              <div className="set-grid">
                                <Field label={`Set ${idx + 1}`}><div className="static">{idx + 1}</div></Field>
                                <Field label="Target"><input value={set.target} onChange={(e) => updateSet(day.key, exercise.name, idx, "target", e.target.value)} /></Field>
                                <Field label="Weight"><input value={set.weight} onChange={(e) => updateSet(day.key, exercise.name, idx, "weight", e.target.value)} /></Field>
                                <Field label="Reps"><input value={set.reps} onChange={(e) => updateSet(day.key, exercise.name, idx, "reps", e.target.value)} /></Field>
                                <div className="field">
                                  <label>&nbsp;</label>
                                  <button className={`btn ${set.done ? "btn-success" : ""}`} onClick={() => updateSet(day.key, exercise.name, idx, "done", !set.done)}>
                                    {set.done ? "Completed" : "Mark done"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Field label="Exercise Notes">
                            <textarea value={log.exerciseNotes[exercise.name]} placeholder="How did this feel? Too heavy? Adjust next week?" onChange={(e) => updateExerciseNote(day.key, exercise.name, e.target.value)} />
                          </Field>
                        </div>
                      </details>
                    );
                  })}
                </div>

                <div className="bottom-grid">
                  <SectionCard>
                    <div className="card-pad">
                      <div className="section-label">Finisher</div>
                      <div className="small" style={{ marginBottom: 10 }}>{day.finisher}</div>
                      <Field label="What you actually did">
                        <input value={log.finisherActual} placeholder="10 min incline walk, 6 incline, 3.7 speed" onChange={(e) => updateDayField(day.key, "finisherActual", e.target.value)} />
                      </Field>
                      <button className={`btn ${log.finisherDone ? "btn-success" : ""}`} onClick={() => updateDayField(day.key, "finisherDone", !log.finisherDone)}>
                        {log.finisherDone ? "Finisher completed" : "Mark finisher done"}
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <div className="card-pad">
                      <div className="section-label">Comments</div>
                      <textarea value={log.comments} placeholder="Energy, food, soreness, time constraints, med side effects, anything notable..." onChange={(e) => updateDayField(day.key, "comments", e.target.value)} />
                    </div>
                  </SectionCard>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
