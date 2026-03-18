import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
          <Route
            path={ROUTES.INCOME}
            element={<PlaceholderPage title="Income & Payments" />}
          />
          <Route
            path={ROUTES.ANALYTICS}
            element={<PlaceholderPage title="Analytics" />}
          />
          <Route
            path={ROUTES.SETTINGS}
            element={<PlaceholderPage title="Settings" />}
          />
          <Route
            path={ROUTES.PROFILE}
            element={<PlaceholderPage title="Profile" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
