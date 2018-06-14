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
var provider = new firebase.auth.GoogleAuthProvider();

Vue.component('todo-list', {
   template: '#todo-template',
    
    data: function(){
        return{
            nuevaTarea: null,
            editandoTarea : null,              
        }           
    },    
    props: ['tareas', 'autentificado', 'usuarioActivo'],
    methods:{
        agregarTarea: function(tarea){           
            db.ref('tareas/').push({
                titulo: tarea, 
                completado: false,
                nombre: vm.usuarioActivo.displayName,                
                uid: vm.usuarioActivo.uid,
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
        // Cargar los datos de BBDD
        db.ref('tareas/').on('value', function(snapshot) {
           vm.tareas = [];
            var objeto = snapshot.val();
            for (var propiedad in objeto) {
                vm.tareas.unshift({
                    '.key': propiedad,
                    completado: objeto[propiedad].completado,
                    titulo: objeto[propiedad].titulo,
                    nombre: objeto[propiedad].nombre,
                    uid: objeto[propiedad].uid,
                });
            }
            
        });        
        
        // Autenticación
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
             console.log('Conectado', user);
              vm.autentificado = true;
              vm. usuarioActivo = user;
          } else {
            console.warn('No conectado');
              vm.autentificado = false;
              vm. usuarioActivo = null;
          }
        });        
    },    
    data:{
        tareas:[],
        autentificado: false,
        usuarioActivo: null,
    },
    methods: {
        conectar: function(){
             provider.addScope('https://www.googleapis.com/auth/plus.login');

               firebase.auth().signInWithPopup(provider).catch(function(error){       

                   console.log('Error haciendo logIn: ', error);         

               });
        },
        desconectar: function(){
            firebase.auth().signOut().catch(function(error){
                 console.log('Error haciendo logOut: ', error);
            });
        }
    },

});