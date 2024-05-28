import { useState, createContext, useContext, useEffect } from "react"
// import toast from "react-hot-toast"
import { ReactNode } from "react"
import { useAppSelector } from "../hooks"
import { EventFull } from "../definitions"
import { useParams } from "react-router-dom"
import { getEvent } from "../api"

const EventContext = createContext<any>(null)

const EventContextProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<EventFull | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(false)
  const { loading, isAuthenticated } = useAppSelector((state) => state.user)

  //useParam
  const { eventId } = useParams()

  // console.log(eventId)

  useEffect(() => {
    if (loading || !isAuthenticated || !eventId)
      return () => {
        setEvent(null)
      }

    setLoadingEvent(true)
    getEvent(eventId)
      .then((data) => {
        setEvent(data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingEvent(false))

    return () => {
      setEvent(null)
    }
  }, [loading, isAuthenticated, eventId])

  return (
    <EventContext.Provider value={{ event, loadingEvent }}>
      {children}
    </EventContext.Provider>
  )
}
const useEventContext = () => {
  return useContext(EventContext)
}

export { EventContext, EventContextProvider, useEventContext }
