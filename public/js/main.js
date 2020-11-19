const 
    id = ID => document.getElementById(ID),
    Query = Q => document.querySelector(Q),
    QueryAll = Q => document.querySelectorAll(Q),
    Store = window.localStorage,
    fileRader = new FileReader()

let 
    NumberSong = 0,
    canciones = [], 
    audio = undefined


//Quita caracteres, extencion y acorta a 24 caracteres agregando ... al final
    const JustText = text => {
    
        return text.split(".mp3")[0].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ').substr(0, 24) + "..."
    }

//Abrrir y cierra un menú
    class Menu{
        constructor(menu, btn, toggleClassMenu, toggleClassBtn){
            this.menu = menu 
            this.btn = btn 
            this.btnClass = toggleClassBtn
            this.menuClass = toggleClassMenu
        }

        change(){
            let
                btn = this.btn.classList.toggle(this.btnClass),
                menu = this.menu.classList.toggle(this.menuClass)  
            return {btn, menu}  
        }
    } 

//Convertir array buser a base65
    const ArrayToB64 = (buffer, type) =>{
        let
            binary = '',
            bytes = new Uint8Array(buffer),
            len = bytes.byteLength

        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        let b64 = type +  window.btoa(binary)
        return b64
    }


class Reproductor{

    constructor(audios,tagAudio){

        this.audios = audios 
        this.tagAudio = tagAudio
    }
    
    PlayPause(btn){

        const playPause = ()=> {
            if(id('audio').paused)
            id('audio').play(),
            Query('.progress .bar div').style.animationPlayState = 'running',
            Query('.pause-btn').style.color = '#fff',
            QueryAll('.pause-btn')[1].style.color = '#fff',
            Query('.play-btn').style.color = 'transparent'
            else 
            
            id('audio').pause(),
            Query('.progress .bar div').style.animationPlayState = 'paused',
            Query('.play-btn').style.color = '#fff',
            Query('.pause-btn').style.color = 'transparent',
            QueryAll('.pause-btn')[1].style.color = 'transparent'
        }
        if(btn)
            btn.addEventListener("click", playPause)
        else 
            playPause()
    }
        
    CargarAudio(play){

        fileRader.readAsDataURL(canciones[NumberSong].song)
        fileRader.onload = () => {
            Store.setItem("NumberSong", NumberSong)
            id("audio").src = fileRader.result
            audio = fileRader
            Query('.progress .name').innerHTML = canciones[NumberSong].title
            if(play){
                this.PlayPause()
            }
        }
    }
    Reset(btn){
        btn.addEventListener("click", ()=>{

            this.tagAudio.currentTime = 0
        })
    }
    Next(btn){

        const next = ()=>{
            if(NumberSong > canciones.length -1){
                NumberSong = 0
            }else{
                NumberSong++
            }
            this.CargarAudio(true)
        }
        if(btn)
            btn.addEventListener("click", ()=>next())
        else 
            next()
    }
    Before(btn){
        btn.addEventListener("click", ()=> {

            if(this.tagAudio.currentTime > 10){
                this.Reset()
                return
            }
            if(NumberSong <= 0){
                NumberSong = canciones.length -1
            }else{
                NumberSong--
            }
            this.CargarAudio(true)

        })
    }

    Volume(btn, InputRange){
        let interval;

        //Coloco el valor del range en el volumen actual
        InputRange.value = id('audio').volume

        //Se despliega el menu al hacer click en el boton
        btn.addEventListener("click", e => {

        //En 5s se vuelve a ocultar 
            Query('.volume').style.width = "40px"
            interval = setTimeout(() => {
                Query('.volume').style.width = "0"
            }, 5000);
        })

        //Se detiene el intervalo para que no se oculte
        Query('.volume').onmousedown = () => clearInterval(interval) 
        
        //Se vuelve a activar el intervalo para esconderse en 5s
        Query('.volume').onmouseup = () => {

            //Se oculta en 5s
            interval = setTimeout(() => {
                Query('.volume').style.width = "0"
            }, 5000);
            
        }
        //Se modifica el volumen al pasar el mause por el input
        InputRange.onmousemove = e => {
            Store.setItem("volumen", e.target.value)
            this.tagAudio.volume = parseFloat(e.target.value)
        }
    }
}

const reproductor = new Reproductor(canciones, id("audio"))

reproductor.PlayPause(id('play-btn'))
reproductor.Next(id('next-btn'))
reproductor.Before(id('before-btn'))
reproductor.Volume(id("volIcon"), Query('.volume input'))
id("audio").onended = () =>reproductor.Next()

//barra de progreso
id('audio').onprogress = e => {

    Query('.progress .bar div').setAttribute('style', `
        transition: .5s;
        animation-name: ;
        width:0%
    `)   
    id('audio').onplay = e => {

        setTimeout(() => {
            
            console.log((e.target.duration - e.target.currentTime )/60)
            Query('.progress .bar div').setAttribute('style', `
                animation-duration: ${e.target.duration - 0.600}s;
                animation-play-state: running;
                animation-name: progress
            `)                
        }, 600);
    }
}  

const Canciones = new GZdb("Canciones", 1)

Canciones.setSchema("Canciones", {
    song: ""
}, {
    keyPath: undefined,
    autoIncrement: true
})


Canciones.getAll("Canciones")
.then( async songs => {
     if(!songs["404"]){
         canciones = await canciones.concat(songs)
         reproductor.CargarAudio()
     }
})


//Actualizo el numbero de la cancion al ultimo estado que tuvo
    NumberSong = parseInt(Store.getItem("NumberSong")) != undefined ?
    Store.getItem("NumberSong") : 0

//Coloco el volumen en el ultimo valor guardado
    id("audio").volume = Store.getItem("volumen") != undefined ?
    Store.getItem("volumen") :  1
    Query(".volume input").value = Store.getItem("volumen") != undefined ?
    Store.getItem("volumen") :  1 

//Estraer todos los datos de una cancion
const Tags = (file) => new Promise(resolve => {

    jsmediatags.read(file, {

        onSuccess:tag=>{
            tag=tag.tags

            let Tags = {}
            Tags["img"] = tag.picture ?
                ArrayToB64(tag.picture.data, "data:" +tag.picture.format + ";base64,") :
                "default.jpg"
            Tags["album"] = tag.album ? tag.album : "Desconocido"
            Tags["artista"] = tag.artist ? tag.artist : "Desconocido"
            Tags["year"] = tag.year ? tag.year : " "
            Tags["trak"] = tag.track? tag.tack : "0"
            Tags["title"] = tag.title? tag.title : tag.name
            resolve(Tags)
        }
    })
})

//Cuando se cargan nuevos archivos se extraen los mp3
//se agrega un title sin la extencion ni simbolos y se agrega a la lista de canciones
    id("input").addEventListener("change", async() => {
        let 
            archivos = id("input").files,
            mp3 = Array.from(archivos).filter(i => i.name.includes(".mp3")),
            audios = []

        mp3.forEach(async (i, j, a) => {

            let 
                tags = await Tags(i),
                song ={ song: i}

            for(let e in tags){
                song[e]=tags[e]
            }

            audios.push(song)


            if(j >= a.length - 1){
                
                let result = await compareArrayJson(audios, canciones)

                Canciones.set("Canciones", result)
                .then(console.log)
                console.log(result)
                canciones = canciones.concat(result)
                if(audio =! undefined){
                    reproductor.CargarAudio()
                }
            }
        })
    })

//Objetos para abrir y cerrar el menus
    const

        menuLeft = new Menu(
            id("btnMenuLeft"), 
            id("menuLeft"), 
            "open", "close"
        ),

        menuBottom = new Menu(
            id("btnMenuBottom"),
            id("tools"),
            "open","open"
        )

//Abrir/cerrar menus
    id("btnMenuBottom").addEventListener(
        "click", () => 
            Store.setItem("menuBottom", menuBottom.change().menu)
    )

    id("btnMenuLeft").addEventListener(
        "click", ()=> menuLeft.change()
    )

    document.addEventListener("keypress", e => {
        if(e.key == 'M'){
            menuLeft.change()
        }
    })

//Colocar menu inferior en el ultimo estado que tuvo
    if(Store.getItem("menuBottom") == "true"){
        menuBottom.change()
    }

