import React, { useState } from "react";

const accent = "#b1122b";
const softAccent = "#fdecee";
const blush = "#fff6f7";

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
  if (mode === "plus") return { q: `${rand(0,100)} + ${rand(0,100)}`, a: 0 };
  if (mode === "minus") return { q: `${rand(0,100)} - ${rand(0,50)}`, a: 0 };
  if (mode === "multiply") return { q: `${rand(1,10)} × ${rand(1,10)}`, a: 0 };
  return { q: `${rand(10,100)} ÷ ${[2,4,5,10][rand(0,3)]}`, a: 0 };
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

  const updateCell = (r,c,val)=>{
    if(sudokuBase[r][c]!==0) return;
    const next = grid.map(row=>[...row]);
    next[r][c]= val===""?0:Number(val);
    setGrid(next);
  };

  return (
    <div style={{padding:20}}>
      <h1>Quintessence</h1>
      <Logo />

      <div>
        <button onClick={()=>setTab("focus")}>focus</button>
        <button onClick={()=>setTab("reflection")}>reflection</button>
        <button onClick={()=>setTab("practice")}>practice</button>
      </div>

      {tab==="focus" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:2}}>
          {grid.flatMap((row,r)=>row.map((cell,c)=>(
            <input key={r+"-"+c}
              value={cell||""}
              onChange={e=>updateCell(r,c,e.target.value)}
              style={{height:40,textAlign:"center"}}
            />
          )))}
        </div>
      )}

      {tab==="practice" && (
        <div>
          <div>{problem.q}</div>
          <input value={answer} onChange={e=>setAnswer(e.target.value)} />
          <button onClick={()=>setIndex(index+1)}>next</button>
        </div>
      )}
    </div>
  );
}
