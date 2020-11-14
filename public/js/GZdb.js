
class GZdb{

    constructor( name, version ){

        this.name = name 
        this.version = version 
        this.Schemas = []

        this.db = (def)=>{

//          Creacion de los almacenes de objetos con los esquemas pasados
            const 
                dbconnect = window.indexedDB.open(name, version)

            dbconnect.onupgradeneeded = e => {
                
                const db = e.target.result

                this.Schemas.forEach(schema => {
                    console.log(schema)
                    let store = db.createObjectStore(schema[0], schema[2])    
                    schema[1].forEach(e => {
                        console.log(e)
                        store.createIndex(e.index, e.index, e.condition)
                    })
                })
            }
            
//      Devolucion de la coneccion para uso de la DB
            dbconnect.onsuccess = e => def(e.target.result)

        }

    }

    setSchema
    (
        name, 
        schema, 
        keyAndIncrement = {
            keyPath: "id",
            autoIncrement: true
        }
    ){
        const 
            Schema = [name, []],
            keys = Object.keys(schema)

        keys.forEach(key => {

//          Guardo la llave como indice y el valor como condicion
            if(typeof schema[key] == "object"){

                Schema[1].push
                (
                    {
                        index: key,
                        condition: schema[key]
                    }
                )

//          Solo guardo la llave 
            }else { 

                Schema[1].push({index: key})
            }

/*            
                El modelo final es el siguiente 
                ["nombre", {
                    index: key,
                    condition?: ValorOfKey
                },? {keyPath: "", autoIncrement: true}]
            
*/            
        })
        Schema.push(keyAndIncrement)
        //Agrego este esquema a los esquemas 
        this.Schemas.push(Schema)
    }

    get(colection, id,def){
        this.db(e => {
            // var transaction = db.transaction(["Usuario"]);
            // var objectStore = transaction.objectStore("Usuario");
            // var request = objectStore.get(1);
            const 
                Store = e.transaction([colection]).objectStore(colection),
                query = Store.get(id)
    
            query.onerror = ev => console.error('Error:', ev.target.error.message);
            
            query.onsuccess = () => {

                if (query.result){
    
                    def(query.result)
                    return
                }
    
                def("404: Nothing to show")
            }
        })
    }

    getAll(colection, def)
    {
        this.db(db=>{

            const 
                Store = db.transaction(colection, 'readonly').objectStore(colection),
                query = Store.openCursor()
            let
                result = []

            query.onerror = ev =>  def(ev)
            return query.onsuccess = ev => {

                const cursor = ev.target.result
                if (cursor)
                {
    
                    let values = cursor.value
                    values["key"] = cursor.key
                    result =    result.concat(values)
                    cursor.continue()
                    
                }else 
                {

                    if(result.length <= 0)
                        def("404: Nothing to show")
                    def(result)
                }
            }
        })
    }
    set(colection, datos, def){
        this.db(e => {

            const transaction = e.transaction(colection, 'readwrite')
            const store = transaction.objectStore(colection)
            if(Array.isArray(datos)){

                datos.forEach(data => store.add(data))
            }else{
                store.add(datos)
            }
            transaction.onerror = err => def(`error:${err}`)
            transaction.oncomplete = e => def("done", e)
        })
    }

}


const db = new GZdb("Mibasededatos", 1)

db.setSchema("users", {
    name: "",
    apellido: "",
    telefono: {unique: true}
})

db.set("users", {
    name: "Jhon",
    apellido: "Guerrero",
    telefono: 3006357498
})

