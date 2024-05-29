import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon, EditIcon, TrashIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Todo = {
  id: number
  text: string
  completed: boolean
}
const initialState = [
  // Create an intial state of todos related to festivities of a wedding
  { id: 1, text: "Send invitations", completed: false },
  { id: 2, text: "Book a venue", completed: false },
  { id: 3, text: "Hire a cater", completed: false },
  { id: 4, text: "Hire a photographer", completed: false },
  { id: 5, text: "Hire a DJ", completed: false },
  { id: 6, text: "Hire a florist", completed: false },
  { id: 7, text: "Hire a decorator", completed: false },
  { id: 8, text: "Hire a wedding planner", completed: false },
  { id: 9, text: "Hire a videographer", completed: false },
  { id: 10, text: "Hire a makeup artist", completed: false },
  { id: 11, text: "Hire a hair stylist", completed: false },
  { id: 12, text: "Hire a bartender", completed: false },
  { id: 13, text: "Hire a cake designer", completed: false },
  { id: 14, text: "Hire a transportation", completed: false },
  { id: 15, text: "Hire a security", completed: false },
  { id: 16, text: "Hire a hotel", completed: false },
]

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(initialState)
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

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
    <div className="px-4">
      <h1 className="text-2xl pl-21 font-bold my-2">Wedding Planning Checklist</h1>
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
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between mb-2 bg-white rounded-md p-4 shadow-md"
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
