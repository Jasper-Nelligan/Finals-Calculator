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
        <input type = "text" class="grade_input" id = "${id}" name = "${id}" maxlength = "6" size = "2">
        <p<span>%</span></p>
    `;
    fragment.appendChild(div);
    
    div = document.createElement("div")
    id = `weight_${counter}`
    div.className = "weight_field";
    div.id = `weight_field_${counter}`
    div.innerHTML = `
        <label for="${id}">Weight:</label>
        <input type="text" class="weight_input" id="${id}" name="${id}" maxlength="6" size="2">
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
    let error_msg = document.getElementById("result");
    if (error_msg != null){
        error_msg.remove();
    }

    let pass_grade = Number(document.getElementById("pass_grade").value);
    if (!pass_grade){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: passing grade was left empty";
        document.body.appendChild(error);
        return;
    }    
    if (isNaN(pass_grade) || pass_grade < 0 || pass_grade > 100){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: passing grade must be a percent between 0 and 100";
        document.body.appendChild(error);
        return;
    }

    let total_grade = 0;
    let total_weight = 0;
    let weighted_grade;
    let grades = document.getElementsByClassName("grade_input");
    let weights = document.getElementsByClassName("weight_input"); 
    for(let i=0;i<grades.length;i++){
        let grade = Number(grades[i].value);
        let weight = Number(weights[i].value);
        if (!grade) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: a grade was left empty";
            document.body.appendChild(error);
            return;
        }
        if (isNaN(grade) || grade < 0 || grade > 100) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: grades must be a percent between 0 and 100";
            document.body.appendChild(error);
            return;
        }
        if (!weight) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: a weight was left empty";
            document.body.appendChild(error);
            return;
        }
        if (isNaN(weight) || weight < 0 || weight > 100) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: weights must be a percent between 0 and 100";
            document.body.appendChild(error);
            return;
        }

        weighted_grade = grade*weight/100;
        total_grade += weighted_grade;
        total_weight += weight;
        console.log("Total weight is now: " + total_weight);
    }

    let remaining_grade = pass_grade - total_grade;
    let exam_weight = Number(document.getElementById("final_weight").value);
    if (!exam_weight) {
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: final exam weight was left empty";
        document.body.appendChild(error);
        return;
    }
    if (isNaN(exam_weight) || exam_weight < 0 || exam_weight > 100) {
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: final exam weight must be a percent between 0 and 100";
        document.body.appendChild(error);
        return;
    }
    if(Number(total_weight)+exam_weight != 100){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: weights must add up to 100%";
        document.body.appendChild(error);
        return;
    }

    let needed_percent = remaining_grade/exam_weight*100;
    let msg = document.createElement("P");
    msg.id = "result";
    msg.innerText = `You will need ${needed_percent}% on the final exam in order to pass this course.`;
    document.body.appendChild(msg);
}

