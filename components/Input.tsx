interface InputProps {
    type?: "text" | "textarea" | "upload" | "submit" | "number"
    placeholder?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input(props: InputProps){
    if(props.type === "textarea"){
        return(
            <>
                <textarea
                    placeholder={props.placeholder}
                    value={props.value}
                    className="p-2 border border-gray-300 w-full"
                />
            </>
        )
    }
    else if(props.type === "submit"){
        return(
            <>
                <input
                    type="submit"
                    value={props.value}
                    className="bg-yellow-300 p-2 rounded-md"
                />
            </>
        )
    }
    else if(props.type === "upload"){
        return(
            <>
                <label className="p-4 border border-gray-400 border-dashed w-full text-center text-gray-700 rounded-md">
                    <input type="file" className="hidden" />
                    {props.value}
                </label>
            </>
        )
    }
    else {
        return(
            <>
                <input
                    type={props.type ? props.type : "text"} 
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    className="p-2 border border-gray-300 w-full rounded-md"
                />
            </>
        )
    }
}