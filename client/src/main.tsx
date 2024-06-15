import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./theme.tsx"

import { Provider } from "react-redux"
import store from "./store"
import { PostHogProvider } from "posthog-js/react"

const options = {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
  autocapture: import.meta.env.DEV ? false : true,
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {import.meta.env.DEV ? (
          <App />
        ) : (
          <PostHogProvider
            apiKey={import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY}
            options={options}
          >
            <App />
          </PostHogProvider>
        )}
      </Provider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
