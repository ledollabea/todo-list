import './App.css';
import React, {useEffect, useState} from 'react';
import { v4 } from "uuid";
import api from "./api"
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs";

const App = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await fetch(api + "/todos").then((res) => res.json()).then((data) => data).catch((error) => console.log(error))

      setLoading(false)
      setTodos(response)
    }

    loadData()

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = {
      id: v4(),
      title,
      time,
      done: false
    };

    await fetch(api + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTodos(() => [...todos, todo])
    setTitle("");
    setTime("");
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    const response = await fetch(api + "/todos/" + todo.id , {
      method: "PATCH",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTodos((previous) => (previous.map((t) => ((t.id === response.id) ? response : t))));

  }

  const handleDelete = async (id) => {
    await fetch(api + "/todos/" + id , {
      method: "DELETE"
    });

    setTodos((previous) => {
      const res = previous.filter((todo) => todo.id!== id)
      if (res.length === 0){
        return []
      }
      return res
    })
  }

  if (loading){
    <p>Carregando...</p>
  }

  return (
    <div className='App'>
      <header>
        <h1>To-Do List</h1>
      </header>
      <div>
        <form className='todo-form' onSubmit={(e) =>  handleSubmit(e)}>
          <section>
            <label htmlFor="task"> Título da tarefa: </label>
            <input type="text" name="task" placeholder='Título da tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required />
          </section>
          <section>
            <label htmlFor="timetable"> Tempo estimado: </label>
            <input type="text" name="timetable" placeholder='Tempo em horas' onChange={(e) => setTime(e.target.value)} value={time || ""} required />
          </section>
          <input id='button-submit' type="submit" value ="Criar tarefa" />
        </form>
      </div>
      <ul>
        {
          todos && todos.length === 0 && 
          <p id="no-todos"> Não há tarefas cadastradas! </p>
        }
        {
          todos && todos.map((item) => (
            <li className='todo-item' key={item.id} >
              <h3 className={item.done ? "done" : "not-done"} >{item.title}</h3>
              <p>Duração: {item.time}h</p>
              <span onClick={() => handleEdit(item)} >
                {item.done ? <BsBookmarkCheckFill className='checkundone' />: <BsBookmarkCheck className='checkdone' />}
              </span>
              <BsTrash className='trash' onClick={() => handleDelete(item.id)} /> 
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App;
