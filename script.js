"use strict";

/* 
 * First time learning about state modules so I've commented accordingly.
 *
 * This is what is known as a state module. It allows private variables in
 * the code, and is a good work around to global variables. This function
 * is known as an immediately invoked function expression since it runs 
 * automatically without needing to be called. The first pair of parentheses 
 * are to wrap the entire function into an expression. The parentheses at the 
 * at the end of the expression run the function. If these parentheses weren't 
 * there, using inc_counter would have to be done as state_module().inc_counter()
 * instead of state_module.inc_counter.
 * 
 */
var state_module = (function () {
    // private variable
    let _counter = 1;

    // public function since it is returned to the caller
    function inc_counter(num){
        _counter ++;
    }

    // public get function
    function get_counter(){
        return _counter
    }

    /* 
     * Returns the two methods. The curly brackets mean that we are returning
     * an object. The use of ':' is the same as creating an attribute for this
     * object and assigning the value on the right to this attribute. This is why
     * the returned function are accessed by state_counter.inc_counter(), since 
     * inc_counter is an attribute of the returned object.
     */
    return {
        inc_counter: inc_counter,
        get_counter: get_counter
    };
})();

function set_buttons(){
    let buttons = document.getElementsByTagName("button");
    /* 
     * An anonymous function is used here to return the add_assignment function
     * itself, not just the function's results.
     */
    buttons[0].addEventListener("click", 
        function(){
            add_assignment();
        }    
    );
    buttons[1].addEventListener("click", 
        function(){
            calculate();
        }
    );
}

function add_assignment(){
    let form = document.getElementById("form");
    let fragment = document.createDocumentFragment();
    let counter = state_module.get_counter();

    // create a new Id to be assigned to 'for' attribute of label
    let id = `grade_${counter}`;
    let div = document.createElement("div");
    div.className = "grade_field";
    div.id = `grade_field_${counter}`
    div.innerHTML = `
        <label for="${id}">Grade:</label>
        <input type = "text" id = "${id}" name = "${id}" maxlength = "3" size = "1" >
        <p<span>%</span></p>
    `;
    fragment.appendChild(div);
    
    div = document.createElement("div")
    id = `weight_${counter}`
    div.className = "weight_field";
    div.id = `weight_field_${counter}`
    div.innerHTML = `
        <label for="${id}">Weight:</label>
        <input type="text" class="weight_input" id="${id}" name="${id}" maxlength="3" size="1">
        <p<span>%</span></p>
    `;
    fragment.appendChild(div)

    let button = document.createElement("button");
    button.type = "button";
    button.id = `remove_${counter}`;
    button.addEventListener("click",
        function(){
            del_assignment(counter);
        }
    );
    button.innerHTML = "Remove";
    fragment.appendChild(button);

    div = document.createElement("div");
    div.className = "clear";
    div.id = `clear_${counter}`;
    div.innerHTML = "&nbsp;"
    fragment.appendChild(div)

    form.appendChild(fragment);
    state_module.inc_counter();
}

function del_assignment(assignment_num){
    console.log("Deleting assignment " + assignment_num);

    let grade = document.getElementById(`grade_field_${assignment_num}`);
    grade.remove();
    let weight = document.getElementById(`weight_field_${assignment_num}`);
    weight.remove();
    let button = document.getElementById(`remove_${assignment_num}`);
    button.remove();
    let clear = document.getElementById(`clear_${assignment_num}`);
    clear.remove();
}

function calculate(){
    let pass_grade = document.getElementById("pass_grade").value;
    let error;
    if (!pass_grade){
        error = document.createElement("P");
        error.innerText = "Error: passing grade was left empty";
        document.body.appendChild(error);
        return;
    }    
    if (isNaN(pass_grade) || pass_grade < 0 || pass_grade > 100){
        error = document.createElement("P");
        error.innerText = "Error: passing grade must be an integer between 0 and 100";
        document.body.appendChild(error);
        return;
    }
    var i;
    var grades = document.getElementsByClassName("grade_input");
    console.log(grades);
    for(i=0;i<grades.length;i++){
        console.log(grades[i].value + ", ");
    }
}

