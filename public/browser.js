function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Change</button>
      <button data-id="${item._id}"class="delete-me btn btn-danger btn-sm">Done</button>
    </div>
  </li>`
}
// intial Page load rendered
let ourHTML = items.map((item)=>{
    return itemTemplate(item)
}).join('');
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)




// Create feature
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", (e)=>{
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then((response)=>{
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value=""
        createField.focus()
        
    }).catch(()=>{
        console.log('please tryagain...')
    })
})



document.addEventListener("click", (a)=>{
    //Delete feature
    if (a.target.classList.contains("delete-me")) {
        if (confirm('Are you sure')){
            axios.post('/delete-item', {id: a.target.getAttribute("data-id")}).then(()=>{
                a.target.parentElement.parentElement.remove()
            }).catch(()=>{
                console.log('please tryagain...')
            })
        }        
    }
    //udate feature
    if (a.target.classList.contains("edit-me")) {
       let userInput = prompt('enter what you want to edit', a.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
       if (userInput){
        axios.post('/update-item', {text: userInput, id: a.target.getAttribute("data-id")}).then(()=>{
            a.target.parentElement.parentElement.querySelector(".item-text").innerHTML =userInput
        }).catch(()=>{
            console.log('please tryagain...')
        })
       }
    }
})