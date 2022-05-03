const myArray = ["stone","paper","scissors"];
function embedElements(){
    myArray.forEach(el => {
        document.getElementById('result').innerHTML +=`<div>${el}</div><br />`;
            // here result is the id of the div present in the dom
    });
};