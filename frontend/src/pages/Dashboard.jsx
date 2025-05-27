import AdminInfoSection from "@components/Dashboard/AdminInfoSection";
import UserSection from "@components/Dashboard/UserSection";
import StockAlertSection from "../components/Dashboard/StockAlertSection";
import StockChartSection from "../components/Dashboard/StockChartSection";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800">Tableau de bord Admin</h1>

    <AdminInfoSection />
    <UserSection />
    <StockAlertSection />
    <StockChartSection />
    </div>
  );
};

export default Dashboard;
