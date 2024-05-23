import Note from "../../models/Note/Note";



interface NoteCardProps{
    note: Note
}




const NoteCard: React.FC<NoteCardProps> = ({ note }) => {

    

    return(
        <div>
            Note
        </div>
    )
}

export default NoteCard;