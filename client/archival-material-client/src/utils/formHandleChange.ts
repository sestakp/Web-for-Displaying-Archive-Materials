




const formHandleChange = (e: React.ChangeEvent<HTMLInputElement>, setFormData: React.Dispatch<React.SetStateAction<any>>) => {

    const { id, value } = e.target;
    setFormData((prevData: any) => ({
        ...prevData,
        [id]: value,
    }));
};

export default formHandleChange;