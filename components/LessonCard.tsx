import type { Lesson } from "@/types/lesson"
import { useRouter } from "next/navigation"

interface LessonCardProps {
    lesson?: Lesson
    id?:string
    className?:string
}



export default function LessonCard(props:LessonCardProps){
    const router = useRouter()

    function routeToLesson(id:string|undefined){
        if(id) router.push('/lesson/' + id)
    }


    if(props.lesson) {
        return(
            <article className={"w-full p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer rounded-md flex flex-col gap-4 items-start text-left" + (props.className && " " + props.className)} onClick={()=>routeToLesson(props.id)}>
                <img src={props.lesson.imageUrl} alt={props.lesson.title} className="w-16 h-16 rounded-lg border border-gray-200" />
                <h3>{props.lesson.title}</h3>
                <p className="text-xl">{props.lesson.price} <span className="text-lg">sats</span></p>
                <p>
                    {props.lesson.description.length > 100 ? <>{props.lesson.description.slice(0, 100)}&hellip;</> : props.lesson.description}
                </p>
            </article>
        )
    }
    else {
        return(
            <article className="w-full p-4 border border-gray-200 rounded-md flex flex-col gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div className="w-full h-4 bg-gray-200 rounded-md"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
                <div className="w-full h-24 bg-gray-200 rounded-md"></div>
            </article>
        )
    }
}