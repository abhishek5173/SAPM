
interface Stock {
    name:String;
    price: String | number;
}

export default function Footcard({name,price}:Stock){
    return(
        <div className="bg-green-600 rounded-3xl w-56 h-14 sm:flex justify-evenly items-center text-white sm:text-xl text-base text-center">
            <div className="font-bold ">{name}</div>
            <div className="font-semibold animate-pulse">{price}</div>
        </div>
    )
}