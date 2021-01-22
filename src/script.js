"use strict";

/** 
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
var stateModule = (function () {
    // private variable
    let _counter = 1;
    // public function since it is returned to the caller
    function incCounter(num){
        _counter ++;
    }

    // public get function
    function getCounter(){
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
        inc_counter: incCounter,
        get_counter: getCounter
    };
})();

/**
 * Sets the onclick events for the buttons initially loaded on the page
 */
function setButtons(){
    let buttons = document.getElementsByTagName("button");
    /* 
     * An anonymous function is used here to return the add_assignment function
     * itself, not just the function's results.
     */
    buttons[0].addEventListener("click", 
        function(){
            addAssignment();
        }    
    );
    buttons[1].addEventListener("click", 
        function(){
            calculate();
        }
    );
}

/**
 * Adds a new line of grade and weight inputs.
 */
function addAssignment(){
    let form = document.getElementById("form_inputs");
    let fragment = document.createDocumentFragment();
    let counter = stateModule.get_counter();

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
    button.className = "remove_btn";
    button.addEventListener("click",
        function(){
            delAssignment(counter);
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
    stateModule.inc_counter();
}

/**
 * Removes all elements related to an assignment field
 * @param {Number} assignment_num assignment number to be removed. This value was automatically
 *                                assigned to the new assignment field when it was created
 */
function delAssignment(assignment_num){
    let grade = document.getElementById(`grade_field_${assignment_num}`);
    grade.remove();
    let weight = document.getElementById(`weight_field_${assignment_num}`);
    weight.remove();
    let button = document.getElementById(`remove_${assignment_num}`);
    button.remove();
    let clear = document.getElementById(`clear_${assignment_num}`);
    clear.remove();
}

/**
 * Reads in form input data and calculates the needed grade for the final. Displays an
 * error message if input could not be processed.
 */
function calculate(){
    let form = document.getElementById("form");

    let error_msg = document.getElementById("result");
    if  (error_msg != null){
        error_msg.remove();
    }

    let pass_grade = Number(document.getElementById("pass_grade").value);
    if  (!pass_grade){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: passing grade was left empty";
        form.appendChild(error);
        return;
    }    
    if  (isNaN(pass_grade) || pass_grade < 0 || pass_grade > 100){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: passing grade must be a percent between 0 and 100";
        form.appendChild(error);
        return;
    }

    let total_grade = 0;
    let total_weight = 0;
    let weighted_grade;
    let missing_grade_count = 0;
    let total_missing_weight = 0;
    let grades = document.getElementsByClassName("grade_input");
    let weights = document.getElementsByClassName("weight_input"); 
    for(let i=0;i<grades.length;i++){
        let grade = Number(grades[i].value);
        let weight = Number(weights[i].value);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: grades must be a percent between 0 and 100";
            form.appendChild(error);
            return;
        }
        if (!weight) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: a weight was left empty";
            form.appendChild(error);
            return;
        }
        if (isNaN(weight) || weight < 0 || weight > 100) {
            let error = document.createElement("P");
            error.id = "result";
            error.innerText = "Error: weights must be a percent between 0 and 100";
            form.appendChild(error);
            return;
        }
        /* Function will calculate average needed for remaining grades plus final
         * if the user has not yet received a grades back for all assignments
         */
        if (!grade) {
            missing_grade_count++;
            total_missing_weight += weight;
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
        form.appendChild(error);
        return;
    }
    if (isNaN(exam_weight) || exam_weight < 0 || exam_weight > 100) {
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: final exam weight must be a percent between 0 and 100";
        form.appendChild(error);
        return;
    }
    if (total_weight+exam_weight != 100){
        let error = document.createElement("P");
        error.id = "result";
        error.innerText = "Error: weights must add up to 100%";
        form.appendChild(error);
        return;
    }

    /* Function will calculate average needed for remaining grades plus final
     * if the user has not yet received a grades back for all assignments
     */
    if (missing_grade_count > 0){
        let remaining_weight = total_missing_weight + exam_weight;
        let needed_percent = remaining_grade/remaining_weight*100;
        let msg = document.createElement("P");
        msg.id = "result";
        let response = personalMsg(needed_percent);
        if(missing_grade_count > 1){
            msg.innerText = `You will need an average of ${needed_percent.toFixed(1)}% on the `
                +`remaining ${missing_grade_count} assignments and on the final exam in `
                +`order to pass this course. ` + response;
        }
        else if(missing_grade_count == 1){
            msg.innerText = `You will need an average of ${needed_percent.toFixed(1)}% `
                +`both on the remaining assignment and on the final exam in order `
                +`to pass this course. ` + response; 
        }

        document.body.appendChild(msg);
        return;
    }

    let needed_percent = remaining_grade/exam_weight*100;
    let msg = document.createElement("P");
    msg.id = "result";
    let response = personalMsg(needed_percent);
    msg.innerText = `You will need ${needed_percent.toFixed(1)}% on the final `
         +`exam in order to pass this course. ` + response;
    form.appendChild(msg);
}

/** 
 * Returns my personalized message based on what the user needs for their final grade
 *
 * @param {Number} needed_grade the grade that is needed on the final to pass
 * 
 * @returns: {String}           a personal note about their grade needed
 */
function personalMsg(needed_grade){
    if (needed_grade <= 0){
        return("Wow. You could literally not go to the final exam and still pass. Not that it's encouraged, "
            +"but I'm still jealous!");
    }
    else if (needed_grade > 0 && needed_grade <= 40){
        return("Should be pretty easy, no?");
    }
    else if (needed_grade > 40 && needed_grade <= 60){
        return("As long as you put some work in I'm sure you'll be fine.");
    }
    else if (needed_grade > 60 && needed_grade <= 80){
        return("You should probably start studying now instead of calculating what you need on the final to pass lmao.");
    }
    else if (needed_grade > 80 && needed_grade <= 90){
        return("Gonna be tight but I believe in you!");
    }
    else if (needed_grade > 90 && needed_grade <=100){
        return("I'll pray for you.");
    }
    else if (needed_grade > 100){
        return("Damn, I'd hate to be you right now.");
    }
}

