import Dashside from "@/components/Dashside";
import Myportfolio from "@/components/Myportfolio";


export default function My() {
    return (
            <div className="flex h-screen w-screen">
               <Dashside/>
                <div className="w-screen h-screen flex justify-center"><Myportfolio/></div>
            </div>
        );
}