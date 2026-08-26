"use client";
import {useState,useEffect} from "react";
import confetti from "canvas-confetti";

interface Goal{
  id:string;
  text:string;
  completed:boolean;
  deadline?:string;
}
export default function Home() {

  const[inputDeadline,setInputDeadline] = useState("")

  const [goals, setGoals]=useState<any[]>([]);

  const[inputText,setInputText]=useState("");
  
  const[isLoaded,setIsLoaded]=useState(false);

  const [editingId,setEditingId] =useState<string| null>(null);
  const [editText, setEditText] = useState("");

  const[filter, setFilter] = useState("all");

  const[SearchQerty, setSearchQuerty] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  useEffect(()=>{
    const saved = localStorage.getItem("saved_goals");
    if (saved){
      setGoals(JSON.parse(saved));
    }
    setIsLoaded(true);
  },[]);

  useEffect(()=>{
    if (darkMode){
      document.documentElement.classList.add("dark");
    } else{
      document.documentElement.classList.remove("dark");
    }
  },[darkMode]);

  useEffect(()=>{
    if (!isLoaded) return;
    localStorage.setItem("saved_goals",JSON.stringify(goals));
  },[goals]);

  useEffect(()=>{
    if(!isLoaded || goals.length===0) return;
    const hasActiveGoals = goals.some(goal=> !goal.completed);
    if (!hasActiveGoals){
      confetti({
        particleCount:250,
        spread:80,
        origin: {y:0.6}
      });
      const audioAll = new Audio("\completedAll.mp3");
      audioAll.volume = 0.4;
      audioAll.play().catch(()=>{})
      
    }
  },[goals,isLoaded]);

  const addGoal = () =>{
    if (inputText.trim()=== "") return;
    const inputTextCon = {id: crypto.randomUUID(),text:inputText,completed:false,deadline: inputDeadline? inputDeadline:undefined};
    setGoals([...goals,inputTextCon]);
    setInputText("");
    setInputDeadline("");
  }
  const deleteGoal =(idToDelete:string)=>{
    setGoals(goals.filter((goal) => goal.id !== idToDelete));
  }
  const toggleGoal =(idToToggle:string)=>{
    setGoals(goals.map((goal)=>{
      if (goal.id === idToToggle){
        const nextCompleted = !goal.completed;
        if(nextCompleted){
          const audio = new Audio("\completed.mp3");
          audio.volume = 0.4;
          audio.play().catch(()=> {});
        }
        return{...goal,completed:nextCompleted};
      }
      return goal;
  }));
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
    })
     .filter(goal =>
                goal.text.toLowerCase().includes(SearchQerty.toLocaleLowerCase())
      );
    const deleteAllGoal= () =>{
      setGoals(goals.filter(goal=> !goal.completed));
    };
  return (
     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center pt-10 px-4 transition-colors duration-300" >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md transition-colors duration-300">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Мой список целей</h1>
            <button
            onClick={()=> setDarkMode(!darkMode)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all active:scale-95 select-none">
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
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
                className="flex-[2] min-w-0 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
              </input>
              <input
              type="text"
              placeholder="дедлайн"
              value={inputDeadline}
              onFocus={(e)=>(e.target.type="date")}
              onBlur={(e)=>{
                if (!e.target.value) e.target.type="text";
              }}
              onChange={(e)=> setInputDeadline(e.target.value)}
              className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm cursor-pointer"
              ></input>
              <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition shrink-0 cursor-pointer"
              onClick={addGoal}>
                Добавить
              </button>
          </div>

          <div className="flex gap-2 mb-6 w-full justify-center">
            {["all", "active", "completed"].map((type) => (
              <button 
              key={type}
              onClick={()=> setFilter(type)}
              className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer select-none ${
                filter === type 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}>
                {type === "all" ? "все" : type === "active" ? "активные" : "выполненные"}
              </button>
            ))}
          </div>

          <input 
          type = "text"
          placeholder="поиск целей"
          value={SearchQerty}
          onChange={(e)=>setSearchQuerty(e.target.value)}
          className="w-full min-w-0 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 mb-4 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm cursor-pointer" >
          </input>

          <ul>
            {[...goals].filter((goal)=> {
                if (filter === "active") return !goal.completed;
                if (filter === "completed") return goal.completed;
                return true;
              })
              .filter(goal =>
                goal.text.toLowerCase().includes(SearchQerty.toLocaleLowerCase())
              )
              .sort((a,b)=> Number(a.completed)-Number(b.completed))
              .map((goal)=>(
              <li key={goal.id} className="text-gray-700 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-gray-700 last:border-none flex justify-between items-center group gap-2">
                <button onClick={()=> toggleGoal(goal.id)}
                  className={`w-4 h-4 rounded-full cursor-pointer border flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    goal.completed ? "bg-blue-500 border-blue-500 text-white": "border-gray-300 dark:border-gray-600 hover:border-blue-400"  
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
                  className="flex-1 border border-blue-400 rounded px-2 py-0.5 outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 text-sm"
                  autoFocus/>
                ) : (
                  <div className="flex-1 flex flex-col min-w-0">
                    <span
                    className={`flex-1 min-w-0 [overflow-wrap:anywhere] break-words pr-4 transition-all ${
                    goal.completed ? "line-through opacity-80 text-gray-400 dark:text-gray-500": "text-gray-700 dark:text-gray-200"}`}>
                    {goal.text}
                    </span>
                     {goal.deadline && (
                      <span className={`text-xs mt-0.5 font-medium ${
                        !goal.completed && new Date(goal.deadline) < new Date(new Date().setHours(0,0,0,0))
                          ? "text-red-500 font-bold" 
                          : "text-gray-400 dark:text-gray-400"
                      }`}>
                         {new Date(goal.deadline).toLocaleDateString("ru-RU")}
                      </span>
                    )}
                  </div>
                )}
                
                {editingId === goal.id ? (
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
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 cursor-pointer hover:text-red-500 font-medium px-2 transition">
                    ✕
                </button>
              </li>
            ))}
          </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center w-full"> 
          <button
          onClick={()=> deleteAllGoal()} 
          className="text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer">
            Удалить выполненые
          </button>

          <div className="mt-4 border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-right">
             {SearchQerty ? "Найдено целей: ":(
              <>
                {filter === "all" && "Всего целей: "}
                {filter === "active" && "Активных целей: "}
                {filter === "completed" && "Выполненных целей: "}
              </>
             )}
              <span className="font-bold text-gray-700 dark:text-gray-200">{filteredGoals.length}</span>
          </div>
        </div>
        </div>
     </div>
  );
}
