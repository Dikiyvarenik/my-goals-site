"use client";
import {useState,useEffect} from "react";

export default function Home() {

  const [goals, setGoals]=useState<string[]>([]);

  const[inputText,setInputText]=useState("");
  
  const[isLoaded,setIsLoaded]=useState(false);
  useEffect(()=>{
    const saved = localStorage.getItem("saved_goals");
    if (saved){
      setGoals(JSON.parse(saved));
    }
    setIsLoaded(true);
  },[]);


  useEffect(()=>{
    if (!isLoaded) return;
    localStorage.setItem("saved_goals",JSON.stringify(goals));
  },[goals]);

  const addGoal = () =>{
    if (inputText.trim()=== "") return;
    setGoals([...goals,inputText]);
    setInputText("");
  }
  const deleteGoal =(indexToDelete:number)=>{
    setGoals(goals.filter((_, index) => index !== indexToDelete));
  }
  return (
     <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex flex-col items-center">Мой список целей</h1>
            <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Новая цель" 
                  value={inputText}
                  onChange={(e)=> setInputText(e.target.value)}
                  onKeyDown={(e)=>{
                    if (e.key === "Enter"){
                      addGoal();
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-700">
                </input>
                <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                onClick={addGoal}>
                  Добавить
                </button>
            </div>
            <ul>
              {goals.map((goal,index)=>(
                <li key={index} className="text-gray-700 py-2 border-b border-gray-100 last:border-none flex justify-between items-center group">
                  <span className="flex-1 break-all pr-4 text-gray-700">{goal}</span>
                  <button
                      onClick={() =>deleteGoal(index)}
                      className="text-gray-400 hover:text-red-500 font-medium px-2 transition">
                      ✕
                  </button>
                  </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-gray-100 text-sm text-gray-500 text-right">
              Целей: <span className="font-bold text-gray-700">{goals.length}</span>
            </div>
        </div>
     </div>
  );
}
