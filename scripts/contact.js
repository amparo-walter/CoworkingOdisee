document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    let name = event.target.querySelector('#name').value;
    let email = event.target.querySelector('#email').value;
    let message = event.target.querySelector('#message').value;

    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/933651888350568499/XPeC1WLck6W_YYMt1sshCE2KVt3V7x2LLYJY9MkDq9o3ix_Fe24YNJyfh18W92MSWlEb");
    request.setRequestHeader('Content-type', 'application/json');
    const params = {content: "Bericht van `"+name+"` `("+email+")`: ```"+message+"```"}
    request.send(JSON.stringify(params));

    event.target.innerHTML += '<p class="msg-sent">Bericht verzonden</p>';

})