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
    this.socket.on('updateData', (tasksPrev) => { this.update(tasksPrev) });
    this.socket.on('addTask', task => { this.addTask(task) });
    this.socket.on('removeTask', task => { this.removeTask(task) });

  }
  updateTaskName(value) {
    this.setState({ taskName: value });
  }

  update(tasksPrev) {
    this.setState({ tasks: [...tasksPrev] });
  }

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  submitForm(e) {
    e.preventDefault()
    const id = uuidv4();
    const newTask = { id: id, name: this.state.taskName };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({taskName: ''});
  }

  removeTask(id) {
    this.setState({ tasks: this.state.tasks.filter(task => task.id !== id) });
    this.socket.emit('removeTask', id);
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
            {tasks.map(task => (<li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => this.removeTask(task.id)}>Remove</button></li>))}


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
