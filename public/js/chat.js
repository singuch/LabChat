Chat = SC.Application.create();

//MODEL
Chat.person = SC.Object.create({'name': null});

//VIEW
Chat.personView = SC.TextField.extend({
    valueBinding: "Chat.person.name"
});

//CONTROLLER
Chat.pending = SC.ArrayProxy.create({
    content: [],
    addPerson: function(person){
        if (!this.contains(person)){
            this.pushObject(person);
        }
    },
    removePerson: function(person){
        this.removeObject(person);
    }
});




//MODEL
Chat.Message = SC.Object.extend({
    'time': null, 'person': null, 'message': null
});

//VIEW
Chat.messageView = SC.TextField.extend({
    keyUp: function(event){
        var value = $('#message').val();
        if (value){
            if (event.which == 13){
                Chat.socket.emit('message', {
                    person: Chat.person.name    ,
                    message: value
                });
            }
            else{
                Chat.socket.emit('typing', { person: Chat.person.name });    
            }
            this.set('value', '');
        }
    }
});

//CONTROLLER
Chat.messages = SC.ArrayProxy.create({
    content: [],
    addMessage: function(data){
        Chat.pending.removePerson(data.person);
        this.insertAt(0, Chat.Message.create(data));
    }
});

$(function(){
    Chat.socket = io.connect('/');
    
    Chat.socket.on('message', function( data ){
        console.log(data);
        Chat.messages.addMessage(data);
    });

    Chat.socket.on('typing', function (data){
       Chat.pending.addPerson( data.person ); 
    });

});

