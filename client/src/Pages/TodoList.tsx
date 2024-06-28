import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon, EditIcon, TrashIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEventContext } from "@/context/EventContext"
import { addTask, updateTask, deleteTask } from "@/api"
import { TodoType } from "@/definitions"

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("")
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null)

  const { event, updateEvent } = useEventContext()
  const todo = event?.checkList || []

  if (!event) return null

  const addTodo = () => {
    if (newTodo.trim()) {
      addTask(event._id, { name: newTodo, completed: false })
        .then(() => {
          updateEvent()
          setNewTodo("")
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const toggleComplete = (todoItem: TodoType) => {
    updateTask(event._id, todoItem._id, {
      name: todoItem.name,
      completed: !todoItem.completed,
    })
      .then(() => {
        updateEvent()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteTodo = (todoItem: TodoType) => {
    deleteTask(event._id, todoItem._id)
      .then(() => {
        updateEvent()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const editTodo = (todo: TodoType) => {
    setEditingTodo(todo)
    setNewTodo(todo.name)
  }

  const updateTodo = () => {
    if (!editingTodo) return
    updateTask(event._id, editingTodo._id, {
      name: newTodo,
      completed: false,
    })
      .then(() => {
        updateEvent()
        setEditingTodo(null)
        setNewTodo("")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!event.isHosted)
    return <div>You are not authorized to view this page.</div>

  return (
    <div className="px-5 py-4 lg:w-4/5 bg-white rounded-2xl my-4 mx-auto">
      <div className="flex  flex-wrap justify-between items-end border-b pb-1 mb-1">
        <h1 className="text-xl md:text-2xl  font-medium my-2 text-slate-800 mb-3">
          Event Checklist for <br />{" "}
          <span className="font-medium text-xl">{event?.name}</span>
        </h1>
        <div className="flex items-center mb-4 md:w-1/2">
          <Input
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow mr-2 bg-white"
          />
          {editingTodo ? (
            <Button onClick={updateTodo}>
              <EditIcon className="mr-2 h-4 w-4" />
              Update
            </Button>
          ) : (
            <Button onClick={addTodo}>
              <CheckIcon className="mr-2 h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>
      <ul>
        {todo
          .sort((a, b) =>
            a.completed === b.completed ? 0 : a.completed ? 1 : -1,
          )
          .map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between mb-2 bg-white rounded-md p-4 shadow-sm"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleComplete(todo)}
                  className="mr-2"
                />
                <span
                  className={`text-sm ${
                    todo.completed ? "text-gray-500 line-through" : ""
                  }`}
                >
                  {todo.name}
                </span>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  onClick={() => editTodo(todo)}
                  className="mr-2"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => deleteTodo(todo)}>
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default TodoList
