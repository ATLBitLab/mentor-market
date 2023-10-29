export default function EditLesson({params}: {params: {noteId: string}}){
    return(
        <>
            {/* Edit Lesson Form */}
            Edit {params.noteId}
            <form>
                <input type="text" placeholder="Lesson Title" />
                <textarea placeholder="Lesson Description" />
                <input type="upload" placeholder="Lesson Image" />
                <p>Note: this will delete the old lesson and launch a new one</p>
                <input type="submit" value="Update Lesson" />
            </form>
        </>
    )
}