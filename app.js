const baseUrl = 'http://localhost:3000'
let user = null
let userId = null
let userRole = null
let previewImageEdit
$(document).ready(function() {
    checkAccessToken()
    
    $('#users').click(function(e) {
        e.preventDefault()
        $('li.sidebar-item').removeClass('active')
        $(this).parent().addClass('active')
        fetchUsers()
        return false
    })

    $('#foods').click(function(e) {
        e.preventDefault()
        $('li.sidebar-item').removeClass('active')
        $(this).parent().addClass('active')
        fetchFoods()
        return false
    })

    $('#submit-register').click(function(e) {
        e.preventDefault()
        registerHandler()
    })

    $('#submit-login').click(function(e) {
        e.preventDefault()
        loginHandler()
    })

    $('#edit-field-image-input').change(function() {
        let file = this.files[0]
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = function(event) {
            $('#edit-image-preview').attr('src', event.target.result)
        }
    })

    $('#create-field-image-input').change(function() {
        let file = this.files[0]
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = function(event) {
            $('#create-image-preview').attr('src', event.target.result)
        }
    })

    $('#reset-image-button').click(function() {
        $('#edit-image-preview').attr('src', previewImageEdit)
    })

    $('#submit-edit').click(function() {
        let id = $('#edit-field-id').val()
        let name = $('#edit-field-name').val()
        let price = $('#edit-field-price').val()
        let categoryId = $('#edit-field-categories').val()
        let description = $('#edit-field-description').val()
        let image = $('#edit-field-image-input')[0].files[0]

        let fd = new FormData()
        fd.append('name', name)
        fd.append('price', price)
        fd.append('categoryId', categoryId)
        fd.append('description', description)
        fd.append('image', image)
        
        $.ajax({
            url: baseUrl + '/foods/' + id,
            method: 'put',
            headers: {
                access_token: localStorage.access_token
            },
            data: fd,
            contentType: false,
            processData: false,
            crossDomain: true
        }).done(response => {
            if (response.status === 'success') {
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    html: `update '${response.data.name}'`
                })
                $('.close').trigger('click')
                $('#foods').trigger('click')
            }
        })
    })

    $('button.close').click(function() {
        $('#edit-field-id').val('')
        $('#edit-field-name').val('')
        $('#edit-field-price').val('')
        $('#edit-field-categories').val('')
        $('#edit-field-description').empty()
        $('#edit-field-image-input').val('')
    })

    $('button.close').click(function() {
        $('#create-field-id').val('')
        $('#create-field-name').val('')
        $('#create-field-price').val('')
        $('#create-field-categories').val('')
        $('#create-field-description').empty()
        $('#create-field-image-input').val('')
    })

    $('button:contains(Close)').click(function() {
        $('#edit-field-id').val('')
        $('#edit-field-name').val('')
        $('#edit-field-price').val('')
        $('#edit-field-categories').val('')
        $('#edit-field-description').empty()
        $('#edit-field-image-input').val('')
    })

    $('button:contains(Close)').click(function() {
        $('#create-field-id').val('')
        $('#create-field-name').val('')
        $('#create-field-price').val('')
        $('#create-field-categories').val('')
        $('#create-field-description').empty()
        $('#create-field-image-input').val('')
    })

    $('#submit-create').click(function() {
        const name = $('#create-field-name').val()
        const price = $('#create-field-price').val()
        const categoryId = $('#create-field-categories').val()
        const description = $('#create-field-description').val()
        const image = $('#create-field-image-input')[0].files[0]

        let fd = new FormData()
        fd.append('name', name)
        fd.append('price', price)
        fd.append('categoryId', categoryId)
        fd.append('description', description)
        fd.append('image', image)
        
        $.ajax({
            url: baseUrl + '/foods',
            method: 'POST',
            headers: {
                access_token: localStorage.access_token
            },
            data: fd,
            contentType: false,
            processData: false,
            crossDomain: true
        }).done(response => {
            Swal.fire({
                title: 'Success',
                icon: 'success',
                html: `Post -> '${response.data.name}'`
            })
            $('.close').trigger('click')
            $('#foods').trigger('click')
        }).fail(err => {
            let errMessage = ''
            err.responseJSON.message.forEach(e => {
                errMessage += `<p class="text-danger">${e}</p>`
            })

            Swal.fire({
                title: 'ERROR',
                icon: 'warning',
                html: errMessage
            })
        })
    })
})


function getAllCategories() {
    $.ajax({
        url: baseUrl + '/foods/categories',
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(response => {
        let allCategories = ''
        if(response.status === 'success') {
            response.data.forEach(c => {
                allCategories += `<option value="${c.id}">${c.name}</option>`
            })

            $('#create-field-categories').empty().append(allCategories)
        }
    })
}

// register handler

function registerHandler() {
    const username = $('input[name="username"]').val()
    const email = $('input[name="email"]').val()
    const password = $('input[name="password"]').val()
    const phone = $('input[name="phone"]').val()
    const address = $('input[name="address"]').val()
    registerRequest(username, email, password, phone, address)
}

function registerRequest(username, email, password, phone, address) {
    $.ajax({
        url: baseUrl + '/register',
        method: 'POST',
        data: {
            username,
            email,
            password,
            phone,
            address
        }
    }).done(response => {
        if(response.status === 'success') {
            toLoginPage()
        }
    }).fail(err => {
        let errMessage = ''
        err.responseJSON.message.forEach(e => {
            errMessage += `<p class="text-danger">${e}</p>`
        })

        Swal.fire({
            title: 'ERROR',
            icon: 'warning',
            html: errMessage
        })
        toRegisterPage()
    })
}


// login handler

function loginHandler() {
    const email = $('#email-login').val()
    const password = $('#password-login').val()

    loginRequest(email, password)
    $('#table-name').text('Users')
}

function loginRequest(email, password) {
    $.ajax({
        url: baseUrl + '/login',
        method: 'POST',
        data: {
            email,
            password
        }
    }).done(response => {
        if (response.status === 'success') {
            toMainApp()
            localStorage.setItem('access_token', response.access_token)
            fetchUsers()
            fetchActiveUser()
        }
    }).fail(err => {
        let errMessage = ''
        err.responseJSON.message.forEach(e => {
            errMessage += `<p class="text-danger">${e}</p>`
        })

        Swal.fire({
            title: 'ERROR',
            icon: 'warning',
            html: errMessage
        })
        toLoginPage()
    })
}

function toMainApp() {
    $('#register').hide()
    $('#login').hide()
    $('#app').show()
}

function toLoginPage() {
    $('#register').hide()
    $('#app').hide()
    $('#login').show()
}

function toRegisterPage() {
    $('#login').hide()
    $('#app').hide()
    $('#register').show()
}

function checkAccessToken() {
    if (localStorage.access_token) {
        toMainApp()
        fetchUsers()
        fetchActiveUser()
        $('#table-name').text('Users')
    } else {
        toLoginPage()
    }
}

function proceedLogout(e) {
    localStorage.clear()
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    toLoginPage()
    return false
}

function fetchActiveUser() {
    $.ajax({
        url: baseUrl + '/user',
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(response => {
        if(response.status === 'success') {
            user = response.data.username
            userId = response.data.id
            userRole = response.data.role
            $('#active-user-name').text(response.data.username)
            $('#active-user-role').text(response.data.role)
        }
    }).fail(err => {
        console.log(err)
    })
}

function fetchUsers() {
    $.ajax({
        url: baseUrl + '/users',
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(response => {
        if (response.status === 'success') {
            $('#table1').next().remove()
            $('#table1 thead').replaceWith(`
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>City</th>
                        <th>Status</th>
                    </tr>
                </thead>
            `)
            $('#table1 tbody').empty()
            response.data.forEach(data => {
                const element = `
                <tr>
                    <td style="text-transform: capitalize;">${data.username}</td>
                    <td>${data.email}</td>
                    <td>${data.phone}</td>
                    <td>${data.address}</td>
                    <td><span class="badge bg-success">Active</span></td>
                </tr>
                `
                $('#data-target').append(element)
            })
        }
    })
}

function fetchFoods() {
    $.ajax({
        url: baseUrl + '/foods',
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(response => {
        if (response.status === 'success') {
            fetchActiveUser()
            if($('#table1').parent().children().last().hasClass('text-center')) {
                $('#table1').parent().children().last().remove()
            }
            $('#table-name').text('Foods')
            $('#table1 thead').replaceWith(`
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
            `)
            $('#table1 tbody').empty()
            response.data.forEach(data => {
                let action = `<button data-food="${data.id}" type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal-view" onclick="viewFood(this)">View</button>`
                if ((userRole === 'admin') || userRole !== 'admin' && userId === data.authorId) {
                    action = `
                    <button data-food="${data.id}" type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal-view" onclick="viewFood(this)">View</button>
                    <button data-food="${data.id}" type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#modal-edit" onclick="editFood(this)">Edit</button>
                    <button data-food="${data.id}" type="button" class="btn btn-danger btn-sm" onclick="deleteFood(this)">Delete</button>
                    ` 
                }
                const element = `
                <tr>
                    <td>${data.name}</td>
                    <td>${priceFormat(data.price)}</td>
                    <td style="text-transform: capitalize;">${data.Category.name}</td>
                    <td>${action}</td>
                </tr>
                `
                $('#data-target').append(element)
            })
            
            const addFoodButton = `<div class="text-center"><button id="addFood" type="button" class="btn btn-outline-dark" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#modal-create" onclick="getAllCategories()"><i class="bi bi-plus-square"></i></button></div>`
            
            $('#table1').parent().append(addFoodButton)
            
        }
    }).fail(err => {
        console.log(err)
    })
}

function deleteFood(el) {
    let foodId = el.attributes['data-food'].value
    
    $.ajax({
        url: baseUrl + '/foods/' + foodId,
        method: 'delete',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(response => {
        Swal.fire({
            title: 'SUCCESS DELETE',
            icon: 'success',
            html: 'Succes delete food'
        })
        $('#foods').trigger('click')
    }).fail(err => {
        console.log(err)
    })
}

function viewFood(e) {
    let foodId = e.attributes['data-food'].value
    getFoodById(foodId)
}

function getFoodById(id) {
    $.ajax({
        url: baseUrl + '/foods/' + id,
        method: 'get',
        headers: {
            access_token: localStorage.getItem('access_token')
        } 
    }).done(response => {
        if (response.status === 'success') {
            $('.modal-title')[0].innerText = response.data.name
            $('#image-view')[0].src = response.data.imgUrl
            $('#price-view')[0].innerHTML = priceFormat(response.data.price)
            $('#category-view')[0].innerHTML = response.data.Category.name
            $('#author-view')[0].innerHTML = response.data.User.username
            $('#description-view')[0].innerHTML = response.data.description
        }
    })
}


function editFood(e) {
    let id = e.attributes['data-food'].value
    $.ajax({
        url: baseUrl + '/foods/' + id,
        method: 'get',
        headers: {
            access_token: localStorage.getItem('access_token')
        } 
    }).done(food => {
        $.ajax({
            url: baseUrl + '/foods/categories',
            method: 'get',
            headers: {
                access_token: localStorage.getItem('access_token')
            }
        }).done(categories => {
            let categoriesOpt = ''
            categories.data.forEach(cat => {
                if(cat.id === food.data.categoryId) {
                    categoriesOpt += `<option value="${cat.id}" selected>${cat.name}</option>`
                } else {
                    categoriesOpt += `<option value="${cat.id}">${cat.name}</option>`
                }
            })

            $('#edit-field-id')[0].value = food.data.id
            $('.modal-edit-title')[0].innerText = 'Edit : ' + food.data.name
            $('#edit-field-name')[0].value = food.data.name
            $('#edit-field-price')[0].value = food.data.price
            $('#edit-field-categories').empty().append(categoriesOpt)
            $('#edit-field-description').empty().val(food.data.description)
            $('#edit-image-preview')[0].src = food.data.imgUrl
            previewImageEdit = food.data.imgUrl
        })
    })
}


function priceFormat(price) {
    return price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    })
}

function onSignIn(googleUser) {
    let tokenId = googleUser.getAuthResponse().id_token
    $.ajax({
        url: baseUrl + '/login-google',
        method: 'POST',
        data: {
            tokenId
        }
    }).done(response => {
        if(response.status === 'success') {
            toMainApp()
            localStorage.setItem('access_token', response.access_token)
            fetchUsers()
            fetchActiveUser()
        }
    })
}

