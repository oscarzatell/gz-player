const 
    id = ID => document.getElementById(ID),
    Query = Q => document.querySelector(Q),
    QueryAll = Q => document.querySelectorAll(Q),
    ToB64 = new FileReader()

let 
    NumberSong = 0

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

Query('.btn-menu').addEventListener('click', ()=>{
    menu.open('open', 'close')
})

document.addEventListener('keypress', e => {
    if(e.key == 'M'){
        menu.open('open', 'close')
    }
})


let audios;
let audio; 

class Reproductor{

    constructor(audios,tagAudio){
        this.audios = audios 
        this.tagAudio = tagAudio
        this.names = ()=>{
            let names = []
            for(audio of audios){
                names = names.concat(audio.name.replaceAll('_' || '-', ' '))
            }
            return names
        }
        this.folder =  audios[0].webkitRelativePath.split('/')[0]
    }
    PlayPause(){

        if(id('audio').paused)
        
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

const init = ()=>{
    ToB64.readAsDataURL(audios[NumberSong])
    ToB64.onload = () => {
     
        Query('.progress .name').innerHTML = reproductor.names()[NumberSong].split('.')[0].split('(')[0]
        id('audio').src = ToB64.result
        reproductor.PlayPause()
        id('audio').play()
    }
}

id('audio').onplay = e => {
    if(id('audio').currentTime <= 0){

        Query('.progress .bar div').setAttribute('style', `
            transition: .5s;
            animation-name: ;
            width:0%
        `)   
        setTimeout(() => {

            Query('.progress .bar div').setAttribute('style', `
            animation-duration: ${e.target.duration}s;
            animation-play-state: running;
            animation-name: progress
        `)                
        }, 50);
    }
}  

Query('input').onchange = () => {

    audios = Query('input').files
    reproductor = new Reproductor(audios, id('audio'))
    init()
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
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
                console.log('Registration succeeded. Scope is ' + reg.scope);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

if(!window.clientInformation.platform.toLowerCase().includes('x86_64')){

}else if(!window.clientInformation.platform.toLowerCase().includes('windows')){

}else{
    id('input').removeAttribute('directory')
    id('input').removeAttribute('webkitdirectory')
    console.log('bye')
}
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

id('arrow').onclick = _ => {
    id('arrow').classList.toggle('open')
    id('tools').classList.toggle('open')
}

id('list').onclick = _ => {
    Query('#screen .disk').style.display = 'none'
    Query('#screen #playlist').innerHTML = reproductor.names()
}

// document.onclick = () => {
    
//     showDirectoryPicker().then(e => a = e)
// }