function createRoom() {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    
    $.post('/create_game', {name: name, password: password}).done(
        (response) => {
            window.location.href = '/game/' + name;
        }
    )
}