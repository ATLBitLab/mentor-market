export default function ConversationPage({params}: {params: {npub: string}}) {
    return(
        <>
            Conversation with {params.npub}
        </>
    )
}