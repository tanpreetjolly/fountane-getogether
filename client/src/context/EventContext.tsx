import { useState, createContext, useContext, useEffect } from "react"
// import toast from "react-hot-toast"
import { ReactNode } from "react"
import { useAppSelector } from "../hooks"
import { EventFull } from "../definitions"
import { useParams } from "react-router-dom"
import { getEvent } from "../api"

const EventContext = createContext<{
  event: EventFull | null
  loadingEvent: boolean
  updateEvent: () => void
}>({
  event: null,
  loadingEvent: false,
  updateEvent: () => {},
})

const EventContextProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<EventFull | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(false)
  const { loading, isAuthenticated } = useAppSelector((state) => state.user)

  //useParam
  const { eventId } = useParams()

  const updateEvent = () => {
    if (!eventId) return
    setLoadingEvent(true)
    getEvent(eventId)
      .then((data: { data: EventFull }) => {
        import.meta.env.DEV && console.log(data.data)
        const eventReceived = data.data
        setEvent(eventReceived)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingEvent(false))
  }

  useEffect(() => {
    if (loading || !isAuthenticated || !eventId)
      return () => {
        setEvent(null)
      }

    updateEvent()

    return () => {
      setEvent(null)
    }
  }, [loading, isAuthenticated, eventId])

  return (
    <EventContext.Provider value={{ event, loadingEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  )
}
const useEventContext = () => {
  return useContext(EventContext)
}

export { EventContext, EventContextProvider, useEventContext }
