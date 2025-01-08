
interface Stock {
    name:String;
    price: String | number;
}

export default function Footcard({name,price}:Stock){
    return(
        <div className="bg-green-600 rounded-3xl w-56 h-14 flex justify-evenly items-center text-white text-xl">
            <div className="font-bold ">{name}</div>
            <div className="font-semibold animate-pulse">{price}</div>
        </div>
    )
}