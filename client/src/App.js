import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('updateData', (tasksPreDefined) => { this.update(tasksPreDefined) });
    this.socket.on('addTask', task => { this.addTask(task) });
    this.socket.on('removeTask', task => { this.removeTask(task) });
  }
  updateTaskName(value) {
    this.setState({ taskName: value });
  }

  update(tasksPreDefined) {
    this.setState({ tasks: [...tasksPreDefined] });
  }

  addTask(task) {
    const { tasks } = this.state;
    this.setState({ tasks: [...tasks, task] });
  }

  submitForm(e) {
    const {  taskName } = this.state;
    e.preventDefault()
    const id = uuidv4();
    const newTask = { id: id, name: taskName };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({taskName: ''});
  }

  removeTask(id, localAction) {
    const { tasks } = this.state;
    this.setState({ tasks: tasks.filter(task => task.id !== id) });
    if(localAction){
    this.socket.emit('removeTask', id);
    console.log('sending removeTask to server only when is done localy first')
  }
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (<li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => this.removeTask(task.id, true)}>Remove</button></li>))}
          </ul>
          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(e) => this.updateTaskName(e.target.value)} />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };
};

export default App;
