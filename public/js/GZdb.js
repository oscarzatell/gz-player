class GZdb{
    constructor
        (
            name, version,
            colection, Schemas,
            keyAndIncrement = {
                keyPath: "id",
                autoIncrement: true
            }
        ){

        this.name = name 
        this.version = version 
        this.Schemas = Schemas
        this.colection = colection
        this.db = (def)=>{
            const 
                dbconnect = window.indexedDB.open(name, version)
                
            dbconnect.onupgradeneeded = e => {
                const
                    db = e.target.result,
                    store = db.createObjectStore(this.colection, keyAndIncrement)
                    
                    this.Schemas.forEach(e => {
                        store.createIndex(e.index, e.index, e.condition)
                    })
            }
            
          
            dbconnect.onsuccess = e => def(e.target.result)

        }
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
            datos.forEach(d => store.add(d))
            transaction.onerror = err => def(`error:${err}`)
            transaction.oncomplete = e => def("done", e)
        })
    }
}

const db = new GZdb("Mibasededatos", 1, "Usuari", [
    {index: "Nickname", condition:{unique: false}},
    {index: "email", condition: {unique: true}}
])

