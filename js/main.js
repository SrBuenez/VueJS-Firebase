var config = {
    apiKey: "AIzaSyBW9W5zgGL3uhNtDuRwxWZRWOrtbUq5_A0",
    authDomain: "vuefirebase-4087f.firebaseapp.com",
    databaseURL: "https://vuefirebase-4087f.firebaseio.com",
    projectId: "vuefirebase-4087f",
    storageBucket: "vuefirebase-4087f.appspot.com",
    messagingSenderId: "736609115146"
};
firebase.initializeApp(config);

var db = firebase.database();

Vue.component('todo-list', {
   template: '#todo-template',
    
    data: function(){
        return{
            nuevaTarea: null,
            editandoTarea : null,              
        }           
    },    
    props: ['tareas'],
    methods:{
        agregarTarea: function(tarea){           
            db.ref('tareas/').push({
                titulo: tarea, completado: false
            });
            this.nuevaTarea = '';
        },
        
        editarTarea: function(tarea){            
           db.ref('tareas/' + tarea['.key']).update({
              titulo: tarea.titulo
           });
        },
        
        actualizarEstadoTarea: function(estado, tarea){
           db.ref('tareas/' + tarea['.key']).update({
               completado: estado ? true : false,
           })
        },
        
        eliminarTarea: function(tarea){
           db.ref('tareas/' + tarea['.key']).remove();
        },
    }
});

var vm = new Vue({
    el: '#main',
    
    mounted: function(){
        db.ref('tareas/').on('value', function(snapshot) {
           vm.tareas = [];
            var objeto = snapshot.val();
            for (var propiedad in objeto) {
                vm.tareas.unshift({
                    '.key': propiedad,
                    completado: objeto[propiedad].completado,
                    titulo: objeto[propiedad].titulo
                });
            }
            
            });
    },
    
    data:{
        tareas:[]
    } 
});