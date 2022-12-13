export const message = (text_tm,text_ru,text_en)=>{
    return {
        tm: text_tm,
        ru: text_ru,
        en: text_en
    }
}

export const defaultMessage = ()=>{
    return {
        tm: "Üstinlikli hasaba alyndy",
        ru: "Успешно",
        en: "Successfully"
    }
}

export const errorMessage = ()=>{
    return {
        tm: "Ýalňyşlyk ýüze çykdy!",
        ru: "Что-то пошло не так!",
        en: "Something went wrong!"
    }
}

export const notAuthorized = ()=>{
    return {
        tm: "Ýalňyşlyk ýüze çykdy!",
        ru: "Что-то пошло не так!",
        en: "Something went wrong!"
    }
}


export const successfullyDeleted = () =>{
    return {
        tm: "Üstünlikli aýyryldy!",
        ru: "Что-то пошло не так!",
        en: "Successfully deleted!"
    }
}

