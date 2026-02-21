import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Dashboard />} />
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
