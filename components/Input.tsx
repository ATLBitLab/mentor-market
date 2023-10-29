"use client"

interface InputProps {
    type?: "text" | "textarea" | "upload" | "submit" | "number"
    placeholder?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => void
    label?: string
}

export default function Input(props: InputProps){
    if(props.type === "textarea"){
        return(
            <div className="flex flex-col gap-1">
                {props.label && <label>{props.label}</label>}
                <textarea
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    className="p-2 border border-gray-300 w-full"
                />
            </div>
        )
    }
    else if(props.type === "submit"){
        return(
            <div className="flex flex-col gap-1">
                {props.label && <label>{props.label}</label>}
                <input
                    type="submit"
                    value={props.value}
                    className="bg-yellow-300 p-2 rounded-md"
                />
            </div>
        )
    }
    else if(props.type === "upload"){
        return(
            <div className="flex flex-col gap-1">
                {props.label && <label>{props.label}</label>}
                <label className="p-4 border border-gray-400 border-dashed w-full text-center text-gray-700 rounded-md">
                    <input type="file" className="hidden" />
                    {props.value}
                </label>
            </div>
        )
    }
    else {
        return(
            <div className="flex flex-col gap-1">
                {props.label && <label>{props.label}</label>}
                <input
                    type={props.type ? props.type : "text"} 
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    className="p-2 border border-gray-300 w-full rounded-md"
                />
            </div>
        )
    }
}