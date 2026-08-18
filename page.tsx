"use client";
import {useState,useEffect} from "react";

export default function Home() {

  const [goals, setGoals]=useState<any[]>([]);

  const[inputText,setInputText]=useState("");
  
  const[isLoaded,setIsLoaded]=useState(false);

  const [editingId,setEditingId] =useState<string| null>(null);
  const [editText, setEditText] = useState("");

  const[filter, setFilter] = useState("all")

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
    const inputTextCon = {id: crypto.randomUUID(),text:inputText,completed:false};
    setGoals([...goals,inputTextCon]);
    setInputText("");
  }
  const deleteGoal =(idToDelete:string)=>{
    setGoals(goals.filter((goal) => goal.id !== idToDelete));
  }
  const toggleGoal =(idToToggle:string)=>{
    setGoals(goals.map((goal)=>
      goal.id === idToToggle ? {...goal, completed:!goal.completed}: goal
    ));
  };
  const startEdit = (id:string,currentText:string)=>{
    setEditingId(id);
    setEditText(currentText);
  };
  
  const saveEdit = (id: string)=>{
    if (editText.trim()==="")return;
    setGoals(goals.map((goal)=>
      goal.id === id ?{...goal,text:editText}:goal
    ));
    setEditingId(null);
    setEditText("");
  };
  const filteredGoals = goals.filter((goal)=>{
    if (filter ==="active") return !goal.completed;
    if (filter ==="completed") return goal.completed;
    return true;
  });
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
                  maxLength={350}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-700">
                </input>
                <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                onClick={addGoal}>
                  Добавить
                </button>
            </div>

            <div className="flex gap-2 mb-6 w-full justify-center">
              <button 
              onClick={()=> setFilter("all")}
              className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer select-none ${
                filter === "all" ? "bg-blue-500 text-white": "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
                все
              </button>
              <button 
              onClick={()=> setFilter("active")}
              className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer select-none ${
                filter === "active" ? "bg-blue-500 text-white": "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
                активные
              </button>
              <button 
              onClick={()=> setFilter("completed")}
              className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer select-none ${
                filter === "completed" ? "bg-blue-500 text-white": "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
                выполненые
              </button>
            </div>

            <ul>
              {[...goals].filter((goal)=> {
                  if (filter === "active") return !goal.completed;
                  if (filter === "completed") return goal.completed;
                  return true;
                })
                .sort((a,b)=> Number(a.completed)-Number(b.completed))
                .map((goal,index)=>(
                <li key={goal.id} className="text-gray-700 py-2 border-b border-gray-100 last:border-none flex justify-between items-center group gap-2">
                  <button onClick={()=> toggleGoal(goal.id)}
                    className={`w-4 h-4 rounded-full cursor-pointer border flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      goal.completed ? "bg-blue-500 border-blue-500 text-white": "border-gray-300 hover:border-blue-400"  
                    }`}>
                    {goal.completed && "✓"}
                  </button>
                  {editingId === goal.id ? (
                    <input
                    type="text"
                    value={editText}
                    onChange={(e)=> setEditText(e.target.value)}
                    onKeyDown={(e)=>{
                      if (e.key === "Enter") saveEdit(goal.id);
                    }}
                    maxLength={350}
                    className="flex-1 border border-blue-400 rounded px-2 py-0.5 outline-none text-gray-700 text-sm"
                    autoFocus/>):(
                    <span
                    className={`flex-1 min-w-0 [overflow-wrap:anywhere] break-words pr-4 transition-all ${
                    goal.completed ? "line-through opacity-80 text-gray-400": "text-gray-700"}`}>
                    {goal.text}
                    </span>
                  )}
                  
                  {editingId === goal.id ?(
                    <button onClick={()=> saveEdit(goal.id)}
                    className="text-xs font-medium text-green-600 hover:text-green-700 cursor-pointer px-1 shrink-0">
                       Сохранить
                    </button>
                  ) : (
                    <button 
                    onClick={()=> startEdit(goal.id, goal.text)}
                    className="text-xs font-medium text-blue-500 hover:text-blue-600 cursor-pointer px-1 shrink-0">
                      Изменить
                    </button>
                  )}
                  <button
                      onClick={() =>deleteGoal(goal.id)}
                      className="text-gray-400 cursor-pointer hover:text-red-500 font-medium px-2 transition">
                      ✕
                  </button>
                  </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-gray-100 text-sm border-t text-gray-500 text-right">
              {filter ==="all"&& "Всего целей:"}
              {filter==="active"&&"Активных целей:"}
              {filter ==="completed"&& "Выполненных целей:"} 
              <span className="font-bold text-gray-700">{filteredGoals.length}</span>
            </div>
        </div>
     </div>
  );
}
