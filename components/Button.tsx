interface ButtonProps {
    children: React.ReactNode,
    onClick?: () => void,
    className?: string,
    format?: "primary" | "secondary"
}

export default function Button(props:ButtonProps){
    return(
        <button
            className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" + (props.className ? " " + props.className : "")}
            onClick={()=>props.onClick?.()}
        >
            {props.children}
        </button>
    )
}