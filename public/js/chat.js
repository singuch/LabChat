Chat = SC.Application.create();

Chat.person = SC.Object.extend({'name': null});

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

//CONTROLLER
Chat.messages = SC.ArrayProxy.create({
    content: [],
    addMessage: function(data){
        this.insertAt(0, Chat.Message.create(data));
    }
});

$(function(){
    Chat.socket = io.connect('/');
    
    Chat.socket.on('message', function( data ){
        console.log(data);
        Chat.messages.addMessage(data);
    });
});