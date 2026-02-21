import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TodaysPlan from "./pages/TodaysPlan";
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Reminders from "./pages/Reminders";
import Insights from "./pages/Insights";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plans" element={<TodaysPlan />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/assistant" element={<AIAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
