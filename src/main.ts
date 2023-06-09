import "./scss/app.scss";
import {z} from "zod";

type KeyType = "name" | "cardNum" | "month" | "year" | "cvc"






const inputName = document.querySelector('input#name')! as HTMLInputElement;
const inputCardNum = document.querySelector('input#card-number')! as HTMLInputElement;
const inputMonth = document.querySelector('input#month')! as HTMLInputElement;
const inputYear = document.querySelector('input#year')! as HTMLInputElement;
const inputCvc = document.querySelector('input#cvc')! as HTMLInputElement;


const zInputName = z.string().regex(/(^[A-Z][a-z]+)(\s)([A-Z][a-z]+)/).min(1);
const zInputCardNum = z.string().regex(/^[\d]{16}$/);
const zMonth = z.string().regex(/^[0|1][\d]$/);
const zYear = z.string().regex(/^[\d]{2}$/);
const zCvc = z.string().regex(/^[\d]{3}$/);
const form = document.querySelector('form')! as HTMLFormElement;
const buttonEl = document.querySelector('button#continue')! as HTMLFormElement;
const showErrors = Array.from(document.querySelectorAll('.show-error'))! as HTMLElement[]


const setup = () => {
    showErrors.forEach(el => el.classList.add('hidden'))
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'))
}

const validateField = (input: HTMLInputElement, zRegex: z.ZodString) => {
    const str = String(input.value.trim())
    const res = zRegex.safeParse(str)
    const showErrorEl = input.closest('.field')?.querySelector('.show-error')! as HTMLElement;
    

    if (!res.success) {
        showErrorEl?.classList?.remove('hidden')
        input.classList.add("error")
        throw Error('failed to validate')
    }



    return res.data

}

const formatCardNum = (input: string) => {
    let str = ""
    input.split('').forEach((ip, index) => {
        str +=((index % 4 !== 0) ? `${ip}` : ` ${ip}`)
    })

    return str
}


const addCardDetails = (name = "Jane Appleseed", cardNum = "0000000000000000", month = "00", year = "00", cvc = "000") => {
    document.querySelector('strong#card-name')!.textContent = name
    document.querySelector('em#card-num')!.textContent = formatCardNum(cardNum)
    document.querySelector('span#card-expiry-date')!.textContent = `${month} / ${year}`
    document.querySelector('span#span-cvc')!.textContent = cvc
}




//App level Data
const _appData = {
    name: "Jane Appleseed",
    cardNum: "0000000000000000",
    month: "00",
    year: "00",
    cvc: "000"
}
let appData = new Proxy(_appData, {
    get(obj, p: KeyType) {
        return obj[p]
    },



    set(obj, p, newVal) {
        const newObj = {...obj}
        newObj[p as KeyType] = newVal as string
        addCardDetails(newObj.name, newObj.cardNum, newObj.month, newObj.year, newObj.cvc)
        return Reflect.set(obj, p, newVal)
    }
})
    


const listen = () => {
    form.addEventListener('input', (e) => {
        e.preventDefault()
        setup()
        const name = validateField(inputName, zInputName);
        appData.name= name
        const number = validateField(inputCardNum, zInputCardNum);
        appData.cardNum =  number
        const month = validateField(inputMonth, zMonth)
        appData.month = month
        const year = validateField(inputYear, zYear)
        appData.year = year
        const cvc = validateField(inputCvc, zCvc)
        appData.cvc = cvc
    })


    form.addEventListener('submit', (e) => {
        e.preventDefault()
        setup()
        const name = validateField(inputName, zInputName);
        const number = validateField(inputCardNum, zInputCardNum);
        const month = validateField(inputMonth, zMonth)
        const year = validateField(inputYear, zYear)
        const cvc = validateField(inputCvc, zCvc)

        Array.from(document.querySelectorAll('section')).forEach(el => {
            if (el.classList.contains("thanks")) el.classList.remove("none");
            else el.classList.add('none');
            appData.name= name
            appData.cardNum= number
            appData.month= month
            appData.year= year
            appData.cvc= cvc

        })
        form.reset()
    })








    buttonEl.addEventListener('click', () => {
        Array.from(document.querySelectorAll('section')).forEach(el => {
            if (el.classList.contains("thanks")) el.classList.add("none");
            else el.classList.remove('none');
        })
    })

}







setup()
listen()

