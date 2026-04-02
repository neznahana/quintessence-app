import React, { useState } from "react";

const accent = "#b1122b";
const softAccent = "#fdecee";

function Logo() {
  return (
    <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="46" height="46" viewBox="0 0 100 100" fill="none">
        <path
          d="M50,8 C78,8 92,26 92,50 C92,78 70,92 50,92 C24,92 10,74 10,50 C10,26 28,16 50,16 C68,16 80,30 80,50 C80,68 66,80 50,80 C34,80 24,66 24,50 C24,36 34,28 50,28 C62,28 70,38 70,50 C70,60 60,70 50,70 C40,70 34,60 34,50 C34,42 40,36 50,36 C58,36 62,42 62,50 C62,56 56,62 50,62 C44,62 42,56 42,50 C42,46 46,42 50,42 C54,42 56,46 56,50"
          stroke={accent}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const sudokuBase = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(mode) {
  if (mode === "plus") {
    const a = rand(0,100);
    const b = rand(0,100);
    return { q: `${a} + ${b}`, a: a + b };
  }
  if (mode === "minus") {
    const a = rand(0,100);
    const b = rand(0,a);
    return { q: `${a} - ${b}`, a: a - b };
  }
  if (mode === "multiply") {
    const a = rand(1,10);
    const b = rand(1,10);
    return { q: `${a} × ${b}`, a: a * b };
  }
  const d = [2,4,5,10][rand(0,3)];
  const r = rand(1,20);
  return { q: `${d*r} ÷ ${d}`, a: r };
}

function createSequence() {
  return [
    ...Array(10).fill("plus"),
    ...Array(10).fill("minus"),
    ...Array(5).fill("divide"),
    ...Array(5).fill("multiply"),
  ];
}

export default function App() {
  const [tab, setTab] = useState("focus");
  const [grid, setGrid] = useState(sudokuBase.map(r=>[...r]));
  const [selected, setSelected] = useState(null);

  const [sequence] = useState(createSequence());
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState(generateProblem(sequence[0]));
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const updateCell = (r,c,val)=>{
    if(sudokuBase[r][c]!==0) return;
    const next = grid.map(row=>[...row]);
    next[r][c]= val===""?0:Number(val);
    setGrid(next);
  };

  const isRelated = (r,c)=>{
    if(!selected) return false;
    return selected.r===r || selected.c===c || (
      Math.floor(selected.r/3)===Math.floor(r/3) && Math.floor(selected.c/3)===Math.floor(c/3)
    );
  };

  const nextProblem = ()=>{
    const next = index+1;
    if(next>=sequence.length){
      setIndex(0);
      setProblem(generateProblem(sequence[0]));
      setFeedback("completed ✧");
      return;
    }
    setIndex(next);
    setProblem(generateProblem(sequence[next]));
  };

  const checkAnswer = ()=>{
    if(Number(answer)===problem.a){
      setAnswer("");
      setFeedback("good, continue ✧");
      nextProblem();
    } else {
      setFeedback("stay with it");
    }
  };

  return (
    <div style={{padding:20, fontFamily:"sans-serif"}}>
      <h1>Quintessence</h1>
      <Logo />

      <div style={{marginBottom:20}}>
        <button onClick={()=>setTab("focus")}>Focus</button>
        <button onClick={()=>setTab("reflection")}>Reflection</button>
        <button onClick={()=>setTab("practice")}>Practice</button>
      </div>

      {tab==="focus" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:2}}>
          {grid.flatMap((row,r)=>row.map((cell,c)=>{
            const given = sudokuBase[r][c]!==0;
            const selectedCell = selected?.r===r && selected?.c===c;
            const related = isRelated(r,c);
            return (
              <input key={r+"-"+c}
                value={cell||""}
                disabled={given}
                onFocus={()=>setSelected({r,c})}
                onChange={e=>updateCell(r,c,e.target.value.replace(/[^1-9]/g,""))}
                style={{
                  height:40,
                  textAlign:"center",
                  fontSize:18,
                  background: given?"black":selectedCell?softAccent:related?"#fff1f3":"#fff9fa",
                  color: given?"white":"black"
                }}
              />
            );
          }))}
        </div>
      )}

      {tab==="reflection" && (
        <div>
          <textarea placeholder="Where did I truly show up today in action?" />
          <textarea placeholder="What challenged me, and what positive outcome do I take from it?" />
          <textarea placeholder="What am I grateful for today, and what do I need to let go of?" />
          <textarea placeholder="And what else?" />
        </div>
      )}

      {tab==="practice" && (
        <div>
          <div>{index+1}/30</div>
          <div>{problem.q}</div>
          <input value={answer} onChange={e=>setAnswer(e.target.value)} />
          <button onClick={checkAnswer}>continue</button>
          <div>{feedback}</div>
        </div>
      )}
    </div>
