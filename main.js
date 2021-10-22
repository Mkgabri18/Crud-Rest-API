const $menu = document.querySelector(".menu-list")
const $forms = document.querySelectorAll("article.form-container")
const $ajaxForm = document.getElementById("ajax");
const $fetchForm = document.getElementById("fetch");
const $asyncForm = document.getElementById("async");
let formActive = "ajax";



// Select element
const d = document,
      $table = d.querySelector(".crud-table"),
      $template = d.getElementById("crud-template").content,
      $fragment = d.createDocumentFragment();

//fill table with response
const fillData = (data) => {
    data.forEach(el => {
        $template.querySelector(".name").textContent = el.name;
        $template.querySelector(".age").textContent = el.age;
        $template.querySelector(".edit").dataset.id = el.id;
        $template.querySelector(".edit").dataset.name = el.name;
        $template.querySelector(".edit").dataset.age = el.age;
        $template.querySelector(".delete").dataset.id = el.id;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
};

// ajax function general
const ajax = (options) => {
    let { url, method, success, error, data } = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
        let json = JSON.parse(xhr.responseText);
        success(json);
        } else {
        let message = xhr.statusText || "Ocurrió un error";
        error(`Error ${xhr.status}: ${message}`);
        }
    });
    console.log("Hice un: ", method || "GET")
    xhr.open(method || "GET", url); // al no meter method por default es GET
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
};

const getAjax = () => {
    console.log("chiamata Ajax");
    // Read - GET
    ajax({
        url: "http://localhost:3000/people",
        success: (res) => {
          console.log(res);
          fillData(res)
        },
        error: (err) => {
          console.log(err);
          $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        }
    })
};

const getFetch = async () => {
    console.log("chiamata Fetch");
    try {
        let res = await fetch("http://localhost:3000/people"),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        console.log(json);
        fillData(json);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
};

const getAxios = async () => {
    console.log("chiamata Axios");
    try {
        let res = await axios.get("http://localhost:3000/people"),
          json = await res.data;

        console.log(json);
        fillData(json);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
};

const getAll = () => {
    //reset table
    $table.querySelector("tbody").innerHTML = "";
    switch(formActive) {
        case 'ajax': getAjax(); //ajax function
                break;
        case 'fetch': getFetch(); //fetch function
                break;
        case 'axios': getAxios(); //axios function
                break;
    }    
};

document.addEventListener("DOMContentLoaded", getAll);

const submitAjax = ($form) => {
    console.log($form)
    if(!$form.id.value) {
        //Create - POST
        ajax({
            url: "http://localhost:3000/people",
            method: "POST",
            success: (res) => getAll(),
            error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
            data: {
              name: $form.nombre.value,
              age: $form.edad.value
            }
        });
    } else {
        //Update - PUT
        ajax({
          url: `http://localhost:3000/people/${$form.id.value}`,
          method: "PUT",
          success: (res) => getAll(),
          error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
          data: {
            name: $form.nombre.value,
            age: $form.edad.value
          }
        });
    }
};

const submitFetch = async ($form) => {
    console.log($form)
    if(!$form.id.value) {
        //Create - POST
        console.log("eseto es un POST")
        try {
            let options = {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                  name: $form.nombre.value,
                  age: $form.edad.value
                })
            },
            res = await fetch("http://localhost:3000/people", options),
            json = await res.json();
  
            if (!res.ok) throw { status: res.status, statusText: res.statusText };
            getAll()
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    } else {
        //Update - PUT
        try {
            console.log("esto es un PUT fetch")
            let options = {
              method: "PUT",
              headers: {
                "Content-type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                name: $form.nombre.value,
                age: $form.edad.value
              })
            },
            res = await fetch(`http://localhost:3000/people/${$form.id.value}`, options),
              json = await res.json();
              
            if (!res.ok) throw { status: res.status, statusText: res.statusText };

            getAll();
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    }
};

const submitAxios = async ($form) => {
    console.log($form)
    if(!$form.id.value) {
        //Create - POST
        console.log("eseto es un POST axios")
        try {
            let options = {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=utf-8"
                },
                data: {
                  name: $form.nombre.value,
                  age: $form.edad.value
                }
            },
            res = await axios("http://localhost:3000/people", options),
            json = await res.data;
  
            getAll()
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    } else {
        //Update - PUT
        try {
            console.log("esto es un PUT axios")
            let options = {
              method: "PUT",
              headers: {
                "Content-type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                name: $form.nombre.value,
                age: $form.edad.value
              })
            },
            res = await axios(`http://localhost:3000/people/${$form.id.value}`, options),
              json = await res.data;
              
            
            getAll();
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
        }
    }
};

//catch data from form
document.addEventListener("submit", (e) => {
    e.preventDefault();
    let $form = e.target;
    switch(formActive) {
        case 'ajax': submitAjax($form);
            break;
        case 'fetch': submitFetch($form);
            break;
        case 'axios': submitAxios($form);
            break;
    }

    $form.reset(); //reset form
});


// Select in menu and layout
$menu.addEventListener("click", (e) => {
    let target = e.target
    for(let item of $menu.children) {
        if(item.classList.contains("is-active")) {
            item.classList.remove("is-active");
        }
    }
    if (target.closest("a")) {
        target.classList.add("is-active");
        for(let item of $forms) {
            if(item.id === target.name) {
                item.classList.add("is-active");
                formActive = item.id;
            }else {
                item.classList.remove("is-active");
            }
        }
        getAll();
    }
});


const deleteAjax = (e) => {
  ajax({
    url: `http://localhost:3000/people/${e.target.dataset.id}`,
    method: "DELETE",
    success: (res) => getAll(),
    error: (err) => alert(err)
  });
};

const deleteFetch = async (e) => {
    try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          }
        },
          res = await fetch(`http://localhost:3000/people/${e.target.dataset.id}`, options),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        getAll();
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
    }
};

const deleteAxios = async (e) => {
    try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          }
        },
          res = await axios(`http://localhost:3000/people/${e.target.dataset.id}`, options),
          json = await res.data;

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        console.log("axiso delete ok")
        getAll();
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
    }
};

document.addEventListener("click", e => {

    if (e.target.matches(".edit")) {
        let $article =  Array.from($forms).find(el => el.id === formActive),
            $form = $article.querySelector(".crud-form"),
            $title = $article.querySelector(".crud-title");
        $title.textContent = "Editar Alumno"; 
        $form.nombre.value = e.target.dataset.name;
        $form.edad.value = e.target.dataset.age;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
      let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

      if (isDelete) {
        //Delete - DELETE
        switch(formActive) {
            case  'ajax': deleteAjax(e);
                
                break;
            case 'fetch': deleteFetch(e);
                break;
            case 'axios': deleteAxios(e);
                break;
        }
      }
    }
});

