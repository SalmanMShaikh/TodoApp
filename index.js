//selectors 
const button = document.querySelector(".button");
const todoItemsContainer = document.querySelector(`.todoItemsContainer`);

let taskCompleted = false;


function creatingTodoElement(userInput, inputDetails) {
    
    //creating todo element container
    let todoElement = document.createElement("div");
    todoElement.classList.add("todoElement");

    //creating elements in todo element container
    let span = document.createElement("span");
    span.classList.add("checkbox-elements");
    todoElement.append(span);

    let input = document.createElement("input");
    input.classList.add("checkbox");
    input.id = "checkbox";
    input.setAttribute("type", "checkbox");

    let label = document.createElement("label");
    label.setAttribute("for", "checkbox");
    label.innerText = "Complete";
    span.append(input, label);

    let para1 = document.createElement("p");
    para1.classList.add("taskTitle");
    para1.innerText = `${userInput}`;

    let para2 = document.createElement("p");
    para2.classList.add("taskDescription");
    para2.innerText = `${inputDetails}`;

    //adding userinput and description to todoElement
    todoElement.append(para1, para2);


    //creating edit and delete buttons in todo elements
    let addTodoEditButton = document.createElement("button")
    addTodoEditButton.innerText = "edit";
    let removeTodoDeleteButton = document.createElement("button");
    removeTodoDeleteButton.innerText = "delete";
    addTodoEditButton.classList.add("editButton");
    removeTodoDeleteButton.className = "removeButton"
    todoElement.append(addTodoEditButton, removeTodoDeleteButton);

    return todoElement;

}




// rendering localStorage on webpage
function renderUI() {

    //clearing user Interface
    while(todoItemsContainer.firstChild){
        todoItemsContainer.removeChild(todoItemsContainer.firstChild);
    }

    if (localStorage.getItem('todos') !== null) {

        //getting data from localStorage if available
        let todosArray = Array.from(JSON.parse(localStorage.getItem("todos")));

        //taking out data from todosArray using for loop
        for (let index = 0; index < todosArray.length; index++) {

            //taking single object from array and extracting title and description
            const todoObject = todosArray[index];
            let title = Object.keys(todoObject);
            let description = todoObject[title];

            //creating todoElement
            let todoElement = creatingTodoElement(title, description);

            //adding the todoelements in container
            todoItemsContainer.append(todoElement);

        }
    }


}

renderUI();




//functions

//creating to do
function createToDo(event) {

    //to remove the default behaviour of form
    event.preventDefault();

    //checking user input
    if (event.target.parentElement.parentElement[0].value === "" || event.target.parentElement.parentElement[1].value === "") {

        console.log("Pls enter the fields");

    } else {

        //saving user input
        let userInput = event.target.parentElement.parentElement[0].value;
        let inputDetails = event.target.parentElement.parentElement[1].value;

        //clearing user inputs
        event.target.parentElement.parentElement[0].value = "";
        event.target.parentElement.parentElement[1].value = "";

        //getting data from local storage
        let todosArray = Array.from(JSON.parse(localStorage.getItem("todos")));

        let object = {
            [userInput]: inputDetails
        }

        //pushing current datta to local storage in form of object
        todosArray.push((object))

        //overwriting localStrage with updated data
        localStorage.setItem("todos", JSON.stringify(todosArray))
        renderUI();

    }
}

button.addEventListener("click", createToDo);








function editAndRemove(event) {

    //deleting todo element
    if (event.target.id === "checkbox") {

        if (taskCompleted) {

            //removing line-through and toggling taskCompleted
            event.target.parentElement.parentElement.children[1].style.textDecoration = "none";
            event.target.parentElement.parentElement.children[2].style.textDecoration = "none";
            taskCompleted = false;

        } else {

            // adding line-through and toggling taskCompleted
            event.target.parentElement.parentElement.children[1].style.textDecoration = "line-through"
            event.target.parentElement.parentElement.children[2].style.textDecoration = "line-through"
            taskCompleted = true;

        }

    } else if (event.target.className === "removeButton") {

        let titleOfDeletingElement;
        let descriptionOfDeletingElement;

        //extracting title and description of deleting element and storing in above variables
        for (let index = 0; index < event.target.parentElement.children.length; index++) {

            if (event.target.parentElement.children[index].className === "taskTitle") {

                titleOfDeletingElement = event.target.parentElement.children[index].innerText;

            } else if (event.target.parentElement.children[index].className === "taskDescription") {
                
                descriptionOfDeletingElement = event.target.parentElement.children[index].innerText;
            }
        }

        //getting array from localStorage
        let todosArray = Array.from(JSON.parse(localStorage.getItem("todos")));

        // removing the element from localStorage by extracting index and using splice
        for (let index = 0; index < todosArray.length; index++) {
            
            let key = Object.keys(todosArray[index])

            if (titleOfDeletingElement == Object.keys(todosArray[index]) && descriptionOfDeletingElement == todosArray[index][key]) {
                
                todosArray.splice(index, 1);

            }
        }

        localStorage.setItem("todos", JSON.stringify(todosArray))
        // event.target.parentElement.remove()
        renderUI();


    } else if (event.target.className === "editButton") {

        //creating edit container
        let editContainer = document.createElement("div");
        editContainer.className = "editContainer";

        //taking out taskTitle to remove from localStorage
        let previousTitle;
        let previousDescription;
        
        for (let index = 0; index < event.target.parentElement.children.length; index++) {

            if (event.target.parentElement.children[index].className === "taskTitle") {

                previousTitle = event.target.parentElement.children[index].innerText;

                //adding editInput to edit container
                let editInput = document.createElement("input");
                editInput.classList.add("editInputTitle");
                editInput.id = "title";
                editInput.setAttribute("type","text");
                editInput.setAttribute("value",`${event.target.parentElement.children[index].innerText}`);
                editContainer.append(editInput)
         
            } else if (event.target.parentElement.children[index].className === "taskDescription") {

                previousDescription = event.target.parentElement.children[index].innerText;
                //adding input description to edit container
                let editInput = document.createElement("input");
                editInput.classList.add("editInputDescription");
                editInput.id = "description";
                editInput.setAttribute("type","text");
                editInput.setAttribute("value",`${event.target.parentElement.children[index].innerText}`);
                editContainer.append(editInput)

            }
        }


        event.target.parentElement.insertAdjacentElement('afterend', editContainer);
        event.target.parentElement.style.display = "none";

        //adding save changes button to edit container
        let button = document.createElement("button");
        button.classList.add("saveChanges");
        button.innerText = "Save Changes";
        editContainer.append(button);
    

        //removing previous input from local storage
        let todosArray = Array.from(JSON.parse(localStorage.getItem("todos")));
        for (let index = 0; index < todosArray.length; index++) {
            let key = Object.keys(todosArray[index])

            if (previousTitle == Object.keys(todosArray[index]) && previousDescription == todosArray[index][key]) {
                todosArray.splice(index, 1);

            }
        }
        localStorage.setItem("todos", JSON.stringify(todosArray))



    } else if (event.target.className === "saveChanges") {

        //toggling task state to not completed
        taskCompleted = false;

        //storing edited title and description using for loop
        let editedTitle;
        let editedDescription;

        for (let index = 0; index < event.target.parentElement.children.length; index++) {

            if (event.target.parentElement.children[index].className === "editInputTitle") {
                
                editedTitle = event.target.parentElement.children[index].value;

            } else if (event.target.parentElement.children[index].className === "editInputDescription") {

                editedDescription = event.target.parentElement.children[index].value;

            }
        }

        //creating todoElement
        let todoElement = creatingTodoElement(editedTitle, editedDescription);

        //adding the todoelements in container
        event.target.parentElement.insertAdjacentElement("beforebegin", todoElement);

        //adding user input to local storage and removing edit container

        let todosArray = Array.from(JSON.parse(localStorage.getItem("todos")));

        let object = {[editedTitle]: editedDescription};
            
        //finding index of todoElement
        let todoIndex;
        
        for(let index = 0; index< event.target.parentElement.parentElement.children.length; index++){
            
            if(event.target.parentElement.parentElement.children[index] == event.target.parentElement){
                
                todoIndex= index-2;
                
            }
        }

        //adding todoElement at specific index
         todosArray.splice(todoIndex,0,object );
       
         //pushing edited todoElement to localStorage
        localStorage.setItem("todos", JSON.stringify(todosArray))

        renderUI();
    }


}

todoItemsContainer.addEventListener("click", editAndRemove);