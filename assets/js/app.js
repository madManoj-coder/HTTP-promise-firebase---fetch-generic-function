const cl = console.log;

const postContainer = document.getElementById("postContainer")
const titleControl = document.getElementById("title")
const bodyControl = document.getElementById("body")
const userIdControl = document.getElementById("userId")
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const postForm = document.getElementById("postForm")

let baseUrl = `https://promise-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/`
// cl(baseUrl)

let postUrl = `${baseUrl}/posts.json`
cl(postUrl)

const objToArr = (obj) => {
    let newArr = []
    for (const key in obj) {
        let object = obj[key]
        object.id = key;
        newArr.push(object)
    }
    return newArr;
}

const makeApiCall = (apiUrl, methodName, msgBody = null) => {
    return fetch(apiUrl, {
        method: methodName,
        body: msgBody,
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => {
            return res.json() // it also returns a promise
        })

}

const onCreateNewPost = eve => {
    eve.preventDefault();
    let newPost = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    // cl(newPost)

    makeApiCall(postUrl, "POST", JSON.stringify(newPost))
        .then(res => {
            //  cl(res)
            newPost.id = res.name;
            createPost(newPost)
        })
        .catch(cl)
        .finally(() => {
            postForm.reset()
        })
}

const createPost = (post) => {
    let card = document.createElement("div");
    card.id = post.id;
    card.className = "card mb-4"
    card.innerHTML = `  <div class="card-header">
                          <h2>${post.title}</h2>
                        </div>
                        <div class="card-body">
                           <p>${post.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-outline-primary" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-outline-danger" onClick="onDelete(this)">Delete</button>
                        </div> 
                     `
    postContainer.append(card)
}

const onEdit = (eve) => {
    let editId = eve.closest(".card").id;
    cl(editId)
    localStorage.setItem("edit", editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`
    cl(editUrl)

    makeApiCall(editUrl, "GET")
        .then(res => {
            cl(res)
            titleControl.value = res.title;
            bodyControl.value = res.body;
            userIdControl.value = res.userId;

            updateBtn.classList.remove("d-none")
            submitBtn.classList.add("d-none")

            function scroll() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                    timer: 100
                });
            }
            scroll()
        })
        .catch(cl)
}

const onUpdatePost = () => {
    let updateId = localStorage.getItem("edit");
    // cl(updateId)
    let updateUrl = `${baseUrl}/posts/${updateId}.json`
    let updateObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    // cl(updateObj)

    makeApiCall(updateUrl, "PATCH", JSON.stringify(updateObj))
        .then(res => {
            cl(res)
            let updatedId = [...document.getElementById(updateId).children]
            updatedId[0].innerHTML = `<h2>${res.title}</h2>`
            updatedId[1].innerHTML = `<p>${res.body}</p>`
        })
        .catch(cl)
        .finally(() => {
            updateBtn.classList.add("d-none")
            submitBtn.classList.remove("d-none")
            postForm.reset()
        })
}

const onDelete = eve => {
    deleteId = eve.closest(".card").id;
    // cl(deleteId)
    deleteUrl = `${baseUrl}/posts/${deleteId}.json`
    // cl(deleteUrl)
    makeApiCall(deleteUrl, "DELETE")
        .then(res => {
            //   cl(res)
            document.getElementById(deleteId).remove()
        })
        .catch(cl)
}


makeApiCall(postUrl, "GET")
    .then(res => {
        // cl(res)
        let postArr = objToArr(res);
        // cl(postArr)
        templatingOfPosts(postArr)
    })
    .catch(cl)


const templatingOfPosts = (arr) => {
    arr.forEach(posts => {
        createPost(posts)
    });
}


updateBtn.addEventListener("click", onUpdatePost)
postForm.addEventListener("submit", onCreateNewPost)