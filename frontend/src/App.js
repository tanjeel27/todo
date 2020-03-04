import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false
      },
      editing: false
    };
    this.fetchTodos = this.fetchTodos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this)  }


    getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount() {
    this.fetchTodos();
  }

  fetchTodos() {
    console.log("Fetching");
    fetch("http://127.0.0.1:8000/api/todo-list/")
      .then(response => response.json())
      .then(data =>
        this.setState({
          todoList: data
        })
      );
  }

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);
    var csrftoken = this.getCookie('csrftoken')
    var url = "http://127.0.0.1:8000/api/todo-create/";

    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/api/todo-update/${ this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }


    fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then(response => {
      this.fetchTodos();
      this.setState({
        activeItem: {
          id: null,
          title: "",
          completed: false
        }
      })
    }).catch(function(error){
      console.log('ERROR', error)
    }
    )
  }

  startEdit(todo){
    this.setState({
      activeItem:todo,
      editing:true,
      
    })
  }

   deleteItem(todo){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/todo-delete/${todo.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{

      this.fetchTodos()
    })
  }

    strikeUnstrike(todo){

    todo.completed = !todo.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/todo-update/${todo.id}/`

      fetch(url, {
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'completed': todo.completed, 'title':todo.title})
      }).then(() => {
        this.fetchTodos()
      })

    console.log('TODO:', todo.completed)
  }

  render() {
    var todos = this.state.todoList;
    var self =this
    return (
      <div className="container">

        <div id="todo-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">

                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange} className="form-control"
                    id="title" value={this.state.activeItem.title}
                    type="text" placeholder="Add Todos"
                  />
                </div>

                <div style={{flex: 1}}>
                  <input id="submit" className="btn btn-warning" type="submit"  value="Add" />
                </div>
              </div>

            </form>
          </div>

          <div id="list-wrapper"></div>
          {todos.map(function(todo, index) {
            return (
              <div key={index} className="todo-wrapper flex-wrapper">
                <div onClick={()=>self.strikeUnstrike(todo)} style={{ flex: 7 }}>
                  {todo.completed==false ? (

                    <span>{todo.title}</span>
                    ) : (
                    <strike>{todo.title}</strike>
                    )
                  
                  }
                </div>

                <div style={{ flex: 1 }}>
                  <button onClick={()=>self.startEdit(todo)} className="btn btn-sm btn-outline-info">Edit</button>
                </div>

                <div style={{ flex: 1 }}>
                  <button onClick={()=>self.deleteItem(todo)} className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
