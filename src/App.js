import React, { useState,useEffect} from 'react';
import './App.css'; 
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos,setTodos] = useState([]);
  const [newTitle,setNewTitle]=useState("");
  const [newDescription,setNewDescription]=useState("");
  const [completedTodos,setCompletedTodos] = useState([]);
  const [currentEdit,setCurrentEdit] = useState("");
  const [currentEditedItem,setCurrentEditedItem] =useState("");


  const handleAddTodo=() =>{
    if (newTitle.trim() === "") {
    alert("Please enter a title for the task!");
    return;
    }
    if (newDescription.trim() === "") {
      alert("Please enter a description for the task!");
      return;
    }

      const isDuplicate = allTodos.some(
    (todo) =>
      todo.title.trim().toLowerCase() === newTitle.trim().toLowerCase() &&
      todo.description.trim().toLowerCase() === newDescription.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("This task already exists!");
      return;
    }

    let newTodoItem={
      title:newTitle,
      description:newDescription
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr));

    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) =>{
    let reducedTodo= [...allTodos];
    reducedTodo.splice(index,1);

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);

  }

  const handleComplete =(index) =>{
    let now=new Date();
    let dd=now.getDate();
    let mm=now.getMonth()+1;
    let yyyy=now.getFullYear();
    let h=now.getHours();
    let m=now.getMinutes();
    let s=now.getSeconds();
    let completedOn = dd+'-'+mm + '-'+yyyy+'- at '+h+':'+m+':'+s;

    let completedItem={
      ...allTodos[index],
      completedOn:completedOn,
    };
    let updatedCompletedArr = [...completedTodos,completedItem];
    //updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    
    localStorage.setItem('completedTodos',JSON.stringify(updatedCompletedArr));

    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    setTodos(reducedTodo);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    };

  const handleDeleteCompletedTodo = index=>{
    let reducedTodo= [...completedTodos];
    reducedTodo.splice(index,1);

    localStorage.setItem('completedtodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  }
  useEffect(() => {
  let savedTodo = JSON.parse(localStorage.getItem('todolist'));
  let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos')); // ✅ fixed key

  if (savedTodo) {
    setTodos(savedTodo);
  }

  if (savedCompletedTodo) {
    setCompletedTodos(savedCompletedTodo);
  }
}, []);

const handleEdit=(ind,item)=>{
  console.log(ind);
  setCurrentEdit(ind);
  setCurrentEditedItem(item);
}
const handleUpdateTitle=(value)=>{
  setCurrentEditedItem((prev)=>{
    return {...prev,title:value}
  })
}
const handleUpdateDescription=(value)=>{
    setCurrentEditedItem((prev)=>{
    return {...prev,description:value};
  });
};
const handleUpdateTodo= ()=>{
  let newTodo = [...allTodos];
  newTodo[currentEdit]= currentEditedItem;
  setTodos(newTodo);
  setCurrentEdit("");
}

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        {/* Input Section */}
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="What's the task title?" />
          </div>

          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text"  value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="What's the task description?" />
          </div>

          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>

        {/* Buttons Section */}
        <div className='btn-area'>
          <button className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button className={`secondaryBtn ${isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* Todo List Section */}
      <div className='todo-list'>


      {isCompleteScreen===false && 
        allTodos.map((item,index)=>{
        if(currentEdit===index){
          return(          
          <div className='edit__wrapper' key={index}>
            <input placeholder='Updated Title'
            onChange={(e)=> handleUpdateTitle(e.target.value)} 
            value={currentEditedItem.title} />
            <textarea placeholder='Updated Title'
            rows={4}
            onChange={(e)=> handleUpdateDescription(e.target.value)} 
            value={currentEditedItem.description} />  
             <button type='button' onClick={handleUpdateTodo} className='primaryBtn'>Update</button>                    
            </div>
            )
        }else{
        return(
          <div className="todo-list-item" key={index}>
              <div className="item-left">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                </div>

                <div className="item-right">
                  <AiOutlineDelete className="icon" onClick={()=> handleDeleteTodo(index)} title="Delete?" />
                  <BsCheckLg className ="icon" onClick={()=>handleComplete(index)} title="Complete?" />
                  <AiOutlineEdit className="icon" onClick={()=> handleEdit(index,item)} title="Edit?" />
                  </div>
                  </div>
        );
      }
      })}


{isCompleteScreen===true && completedTodos.map((item,index)=>{
        return(
          <div className="todo-list-item" key={index}>
              <div className="item-left">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><small>Completed on : {item.completedOn}</small></p>
                </div>

                <div className="item-right">
                  <AiOutlineDelete className="icon" onClick={()=> handleDeleteCompletedTodo(index,item)} title="Delete?" />
                  
                  </div>
                  </div>
        );
      })}

</div>

      </div>
    </div>
  );
}

export default App;
