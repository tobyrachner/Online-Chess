function createRoom(form) {
    let name = form.querySelector('input[name="name"]').value;
    let password = form.querySelector('input[name="password"]').value;
    
    $.post('/create_game', {name: name, password: password}).done(
        (response) => {
            window.location.href = '/game/' + name + '?locked=False';
        }
    )
}

function joinRoom(form) {
    let name = form.querySelector('input[name="name"]').value;
    let password = form.querySelector('input[name="password"]').value;
    let spectate = form.querySelector('input[name="spectate"]').checked;
    console.log(name, password, spectate);

    $.post('/join_game', {name: name, password: password, spectate: spectate}).done(
        (response) => {
            console.log(response.locked)
            window.location.href = '/game/' + name + '?locked=' + response;
        }
    )
}