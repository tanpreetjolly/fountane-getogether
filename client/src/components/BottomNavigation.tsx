import React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import { User, Calendar, Search, Home } from "lucide-react"
import { makeStyles } from "@mui/styles"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@/hooks"

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTop: "1px solid #e0e0e0",
    zIndex: 20,
    "& .Mui-selected": {
      color: "#6366f1", // Tailwind's indigo-600
    },
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
    height: 24,
    width: 1,
    backgroundColor: "#e0e0e0",
  },
})

const BottomNav = () => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const navigate = useNavigate()

  const { isAuthenticated } = useAppSelector((state) => state.user)

  return (
    <div>
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue)
        }}
        className={classes.root}
      >
        {!isAuthenticated ? (
          <BottomNavigationAction
            icon={<Home size={24} />}
            disableRipple
            onClick={() => {
              navigate("/")
            }}
          />
        ) : (
          <BottomNavigationAction
            icon={<Calendar size={24} />}
            disableRipple
            onClick={() => {
              // Handle all events navigation
              navigate("/events")
            }}
          />
        )}
        <BottomNavigationAction
          icon={<Search size={24} />}
          disableRipple
          onClick={() => {
            navigate("/search?type=user&query=hello")
          }}
        />

        <BottomNavigationAction
          icon={<User size={24} />}
          disableRipple
          onClick={() => {
            // Handle profile navigation
            navigate("/profile")
          }}
        />
      </BottomNavigation>
      <style>{`
        // selected mui button in bottom navigation should have indigo-700
        .Mui-selected {
          color: #6366f1 !important;
        }
      `}</style>
    </div>
  )
}

export default BottomNav
