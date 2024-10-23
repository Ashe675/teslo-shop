

export const sleep = (second: number = 1) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, second * 1000);
    })

}