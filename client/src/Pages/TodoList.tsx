import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon, EditIcon, TrashIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEventContext } from "@/context/EventContext"

type Todo = {
  id: number
  text: string
  completed: boolean
}

const TodoList = () => {
  const initialState = [
    // Create an intial state of todos related to festivities of a wedding
    { id: 1, text: "Send invitations", completed: false },
    { id: 2, text: "Book a venue", completed: false },
    { id: 3, text: "Hire a cater", completed: false },
    { id: 4, text: "Hire a photographer", completed: false },
  ]
  const [todos, setTodos] = useState<Todo[]>(initialState)
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const { event } = useEventContext()

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodo(todo.text)
  }

  const updateTodo = () => {
    if (editingTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, text: newTodo } : todo,
        ),
      )
      setEditingTodo(null)
      setNewTodo("")
    }
  }

  return (
    <div className="px-4 py-2">
      <h1 className="text-2xl pl-21 font-semibold my-2">{event?.name} Todos</h1>
      <div className="flex items-center mb-4">
        <Input
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow mr-2"
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
      <ul>
        {todos
          .sort((a, b) =>
            a.completed === b.completed ? 0 : a.completed ? 1 : -1,
          )
          .map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between mb-2 bg-white rounded-md p-4 shadow-sm"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleComplete(todo.id)}
                  className="mr-2"
                />
                <span
                  className={`text-sm ${
                    todo.completed ? "text-gray-500 line-through" : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => editTodo(todo)}
                  className="mr-2"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => deleteTodo(todo.id)}>
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
