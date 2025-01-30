import Dashboard from "@/components/Dashboard";
import Dashside from "@/components/Dashside";

export default function dashboard(){
    return(
        <div className="grid grid-cols-2 ">
            <Dashside/>
            <Dashboard/>
            </div>
    )
}