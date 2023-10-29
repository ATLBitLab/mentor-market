import Input from "@/components/Input"

export default function NewLesson(){
    return(
        <>
            {/* Lesson Input Form */}
            <form className="flex flex-col gap-4">
                <Input placeholder="Give a title to your lesson" />
                <Input type="textarea" placeholder="Describe your lesson in about 50 words." />
                <Input type="upload" value="Add an Image" />
                <Input type="submit" value="Post Lesson" />
            </form>
        </>
    )
}