export default function LessonPage({params}: {params: {noteId: string}}){
    return(
        <>
            {/* Lesson Page */}
            Lesson {params.noteId}
        </>
    )
}