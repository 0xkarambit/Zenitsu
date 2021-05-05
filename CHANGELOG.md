## CHANGELOG

1. changed comments section styling.
2. moved BrowerRouter outside App component.

> You can't use any of the hooks from within the same component that puts the Router into the tree.

> You need to move your BrowserRouter out of that component. It can go in the ReactDOM.render() call, for instance.
