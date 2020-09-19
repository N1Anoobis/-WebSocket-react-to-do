const express = require('express')
const socket = require('socket.io');
const cors = require('cors');
const app = express()
app.use(cors());

const server = app.listen(8000, () => {
  
});
const io = socket(server);


let tasks = [{
  id: 1,
  name: 'Prorgaming'
},
{
  id: 2,
  name: 'Go out'
}
];


io.on('connection', (socket) => {

  socket.emit('updateData', tasks)

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('addTask '+ tasks);
  });
  socket.on('removeTask', (index) => {
    tasks.filter(task => {
      task.id != index
    })
    socket.broadcast.emit('removeTask', index);
    console.log('removeTask '+ tasks);
  });
});



app.use((req, res) => {
  res.status(404).send({
    message: 'Not found...'
  });
});