


interface FormErrorLabelProps{
    text: string
}

const FormErrorLabel: React.FC<FormErrorLabelProps> = ({ text }) => {

    return(
        <p style={{color: "red"}}>
            {text}
        </p>
    )

}

export default FormErrorLabel;