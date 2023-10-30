import misc from  "@/public/lesson-cat-misc.jpg"
import cooking from  "@/public/lesson-cat-cooking.jpg"
import code from "@/public/lesson-cat-code.jpg"
import fitness from "@/public/lesson-cat-fitness.jpg"
import science from "@/public/lesson-cat-science.jpg"
import art from "@/public/lesson-cat-art.jpg"
import Image, { StaticImageData } from "next/image"

interface CategoryProps {
    image: StaticImageData
    name: string
    selected?: boolean
    onClick?: () => void
}

export default function Category(props:CategoryProps){
    return(
        <div className={"flex flex-col gap-4 items-center justify-center border border-gray-200 rounded-xl p-8 hover:cursor-pointer" + (props.selected ? "  border-gray-700" : "")} onClick={props.onClick}>
            <Image src={props.image} alt="" width={200} className="w-36 h-36 rounded-xl" />
            <p>{props.name}</p>
        </div>
    )
}