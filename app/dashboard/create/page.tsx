import Dashside from "@/components/Dashside";
import Portfolio from "@/components/Portfolio";

export default function CreatePortfolio() {
    return (
            <div className="flex h-screen w-screen">
               <Dashside/>
                <div className="w-screen h-screen flex justify-center"><Portfolio/></div>
            </div>
        );
}