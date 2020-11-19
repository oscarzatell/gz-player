const 
    id = ID => document.getElementById(ID),
    Query = Q => document.querySelector(Q),
    QueryAll = Q => document.querySelectorAll(Q),
    ToB64 = new FileReader()

// Aquí se almacena el numero de la cancion que se esta reproducioendo
let 
    NumberSong = 0,
    canciones, 
    audio,
    audios

// Abrir y cerrar el menú
class Menu{
    constructor(btn, menu){
        this.menu = menu
        this.btn = btn
   
    }

    open(btnClass, menuClass){
        this.btn.classList.toggle(btnClass)
        this.menu.classList.toggle(menuClass)
    }
}

const menu = new Menu(id('btn'), Query('nav.menu'))
//Abrir menu con boton amburguesa
Query('.btn-menu').addEventListener('click', ()=>{
    menu.open('open', 'close')
})

//Abrir menú con (shit + m)
document.addEventListener('keypress', e => {
    if(e.key == 'M'){
        menu.open('open', 'close')
    }
})


class Reproductor{

    constructor(audios,tagAudio){
        this.audios = audios 
        this.tagAudio = tagAudio
        this.names = ()=>{
            let names = []
            for(audio of audios){
                names = names.concat(audio.name.replaceAll('_' || '-', ' ').replace(/[0-9]+/g, ''))
            }
            return names
        }
        this.folder =  audios[0].webkitRelativePath.split('/')[0]
    }
    PlayPause(){

        if(id('audio').paused)
            cargarAudio(),
            id('audio').play(),
            Query('.progress .bar div').style.animationPlayState = 'running',
            Query('.pause-btn').style.color = '#bfbfbf',
            QueryAll('.pause-btn')[1].style.color = '#bfbfbf',
            Query('.play-btn').style.color = 'transparent'
        else 
    
            id('audio').pause(),
            Query('.progress .bar div').style.animationPlayState = 'paused',
            Query('.play-btn').style.color = '#bfbfbf',
            Query('.pause-btn').style.color = 'transparent',
            QueryAll('.pause-btn')[1].style.color = 'transparent'
    }
    Reset(){
        this.tagAudio.currentTime = 0
        init()
    }
    Next(){

        if(NumberSong > audios.length -1){
            NumberSong = 0
        }else{
            NumberSong++
        }
        init()
    }
    Before(){

        if(this.tagAudio.currentTime > 10){
            this.Reset()
            return
        }
        if(NumberSong <= 0){
            NumberSong = audios.length -1
        }else{
            NumberSong--
        }
        init()
    }
}


let reproductor;

const cargarAudio = ()=>{
    ToB64.readAsDataURL(audios[NumberSong])
    ToB64.onload = () => {
     
        Query('.progress .name').innerHTML = reproductor.names()[NumberSong].split('.')[0].split('(')[0]
        id('audio').src = ToB64.result
    }
}
a1 = [{
    name: "sad",
    apellido: "dad",
    amor: "xd"
},{
    name: "suad",
    apellido: "dad",
    amor: "xd"
}]

a1 = {
    name: "sad",
    apellido: "dad",
    amor: "xd"
}



    for(let a in nuevo){
        for(let b in primero){

        }
    }

    if(p1.length > p2.length){

        for(let a in p1){
            p1[a].title == p2[a].title 
            p1[a].album == p2[a].album
            p1[a].artista == p2[a].artista
        }
    }else{
        for(let a in p1){
            if(
            p2[a].title == p1[a].name &&
            p2[a].album == p1[a].album &&
            p2[a].artista == 12[a].artista
            ){}else{

            }
        }
    }


Query('input').onchange = () => {
    Musica.set("Music",{
        musica: Query('input').files
    }).then(e=>alert("Canciones guardadas"))
    audios = Array.from(Query('input').files).filter(e => e.name.includes('.mp3'))
    reproductor = new Reproductor(audios, id('audio'))
    Query('.progress .name').innerHTML = reproductor.names()[NumberSong].split('.')[0].split('(')[0]
}


id('play-btn').onclick = ()=>{
    reproductor.PlayPause()
}

id('next-btn').onclick = ()=>{
    reproductor.Next()
}

id('before-btn').onclick = ()=>{
    reproductor.Before()
}
id('audio').onended = ()=>{

    reproductor.Next()
}

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js')
//             .then(reg => {
//                 console.log('Registration succeeded. Scope is ' + reg.scope);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

// if(!window.clientInformation.platform.toLowerCase().includes('x86_64')){

// }else if(!window.clientInformation.platform.toLowerCase().includes('windows')){

// }else{
//     id('input').removeAttribute('directory')
//     id('input').removeAttribute('webkitdirectory')
// }

Query('.volume input').value = id('audio').volume
let interval;

id("volIcon").onclick = e => {
    Query('.volume').style.width = "40px"
    interval = setTimeout(() => {

        Query('.volume').style.width = "0"
    }, 5000);
}

Query('.volume').onmousedown = () => {

    clearInterval(interval) 
}

Query('.volume').onmouseup = () => {

    interval = setTimeout(() => {

        Query('.volume').style.width = "0"
    }, 5000);
    
}

Query('.volume input').onmousemove = e => {

    console.log(parseFloat(e.target.value))
    id('audio').volume = parseFloat(e.target.value)
}

id('list').onclick = _ => {
    Query('#screen .disk').style.display = 'none'
    Query('#screen #playlist').innerHTML = reproductor.names()
}

// let d;
// let xd = () => {
// jsmediatags.read(audio, {
//     onSuccess: function(tag) {
//       console.log(tag);
//   d = tag.tags
//     },
//     onError: function(error) {
//       console.log("error");
//     }
//   });
// }
// document.onclick = () => {
    
//     showDirectoryPicker().then(e => a = e)
// }