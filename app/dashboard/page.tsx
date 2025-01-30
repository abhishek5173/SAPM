import Dashboard from "@/components/Dashboard";
import Dashside from "@/components/Dashside";

export default function DashboardPage() {
    return (
        <div className="flex h-screen w-screen">
           <Dashside/>
            <div className="w-screen h-screen flex justify-center"><Dashboard/></div>
        </div>
    );
}