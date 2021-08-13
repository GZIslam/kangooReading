export const request = async (url, method, body) => {
    console.log(body);
    if(method && method == "POST") {
        return fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .catch(error => console.error(error))
    } else {
        return fetch(url, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .catch(error => console.error(error))
    }
}