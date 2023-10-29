export default function NewLesson(){
    return(
        <>
            {/* Lesson Input Form */}
            <form>
                <input type="text" placeholder="Lesson Title" />
                <textarea placeholder="Lesson Description" />
                <input type="upload" placeholder="Lesson Image" />
                <input type="submit" value="Post Lesson" />
            </form>
        </>
    )
}