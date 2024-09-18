
const getUsers = async function () {
    try {
        const res = await fetch('http://localhost:3000/users');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        showUsers(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};
getUsers();
const showUsers = function (data) {
    const trElement = data.map((item, index) => {
        return `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.username}</td>
            <td>${item.password}</td>
            <td>${item.age}</td>
            <td><img src="${item.image}" style="height:50px" alt="User Image"></td>
            <td>${item.note}</td>
            <td>
                <button data-id="${item.id}" style="padding: 12px; margin: 0 12px;" class="btn-delete btn btn-danger">Xóa</button>
                <button data-id="${item.id}" style="padding: 12px; margin: 0 12px;" class="btn-edit btn btn-warning">Sửa</button>
            </td>
        </tr>
        `;
    }).join('');
    const tbodyElement = document.querySelector('tbody');
    tbodyElement.innerHTML = trElement;
    const btnDelete = document.querySelectorAll('.btn-delete');
    btnDelete.forEach((item) => {
        item.addEventListener("click", function () {
            const id = item.dataset.id;
            deleteUser(id);
        });
    });
    const btnEdit = document.querySelectorAll('.btn-edit');
    btnEdit.forEach((item) => {
        item.addEventListener("click", function () {
            const id = item.dataset.id;
            getUserById(id);
        });
    });
};
const deleteUser = async function (id) {
    if (confirm("Bạn muốn xóa không?")) {
        try {
            const res = await fetch(`http://localhost:3000/users/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Xóa thành công");
                getUsers(); // Refresh the user list
            } else {
                alert("Xóa thất bại");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Có lỗi xảy ra");
        }
    }
};
const addUser = async function (data) {
    try {
        const res = await fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert("Thêm thành công");
            getUsers();
        } else {
            alert("Thêm thất bại");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra");
    }
};
const btnAdd = document.querySelector('#btn-add');
const body = document.querySelector('body');

btnAdd.addEventListener("click", function () {
    body.innerHTML = `
    <div class="container">
    <h1>Thêm</h1>
    <form id="user-form">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username">
      </div>
      <div class="mb-3">
        <label for="Password" class="form-label">Password</label>
        <input type="password" class="form-control" id="Password">
      </div>
      <div class="mb-3">
        <label for="Age" class="form-label">Age</label>
        <input type="number" class="form-control" id="Age">
      </div>
      <div class="mb-3">
        <label for="Image" class="form-label">Image</label>
        <input type="file" class="form-control" id="Image">
      </div>
      <div class="mb-3">
        <label for="Note" class="form-label">Note</label>
        <input type="text" class="form-control" id="Note">
      </div>
      <button id="btn-submit" type="submit" class="btn btn-primary">Submit</button>
    </form>
    </div>`;
    const form = document.querySelector('#user-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputUsername = document.querySelector("#username");
        const inputPassword = document.querySelector("#Password");
        const inputAge = document.querySelector("#Age");
        const inputImage = document.querySelector("#Image");
        const inputNote = document.querySelector("#Note");

        if (!inputUsername.value) {
            alert("Username không để trống");
            inputUsername.focus();
            return;
        }
        if (!inputPassword.value) {
            alert("Password không để trống");
            inputPassword.focus();
            return;
        }
        if (!inputAge.value) {
            alert("Age không để trống");
            inputAge.focus();
            return;
        }
      

        const file = inputImage.files[0];
        if (!file) {
            alert("Image không để trống");
            inputImage.focus();
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64Image = reader.result.split(',')[1];
            const data = {
                username: inputUsername.value,
                password: inputPassword.value,
                age: inputAge.value,
                image: `data:${file.type};base64,${base64Image}`,
                note: inputNote.value
            };

            await addUser(data);
        };
        reader.readAsDataURL(file);
    });
});
const getUserById = async function(id){
    try {
        const res = await fetch(`http://localhost:3000/users/${id}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        console.log(data);

        body.innerHTML = `
        <div class="container">
        <h1>Sửa</h1>
        <form id="user-form">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" value="${data.username}">
          </div>
          <div class="mb-3">
            <label for="Password" class="form-label">Password</label>
            <input type="password" class="form-control" id="Password" value="${data.password}">
          </div>
          <div class="mb-3">
            <label for="Age" class="form-label">Age</label>
            <input type="number" class="form-control" id="Age" value="${data.age}">
          </div>
          <div class="mb-3">
            <label for="Image" class="form-label">Image</label>
            <input type="file" class="form-control" id="Image">
            <img src="${data.image}" style="height:50px; display:block; margin-top:10px;" alt="Current User Image">
          </div>
          <div class="mb-3">
            <label for="Note" class="form-label">Note</label>
            <input type="text" class="form-control" id="Note" value="${data.note}">
          </div>
          <button id="btn-submit" type="submit" class="btn btn-primary">Cập nhật</button>
        </form>
        </div>`;

        // Handle form submission for updates
        const updateForm = document.querySelector('#user-form');
        updateForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const inputUsername = document.querySelector("#username");
            const inputPassword = document.querySelector("#Password");
            const inputAge = document.querySelector("#Age");
            const inputImage = document.querySelector("#Image");
            const inputNote = document.querySelector("#Note");

            if (!inputUsername.value) {
                alert("Username không để trống");
                inputUsername.focus();
                return;
            }
            if (!inputPassword.value) {
                alert("Password không để trống");
                inputPassword.focus();
                return;
            }
            if (!inputAge.value) {
                alert("Age không để trống");
                inputAge.focus();
                return;
            }
          

            let base64Image = data.image.split(',')[1]; // Use existing image if not changed
            const file = inputImage.files[0];
            if (file) {
                base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        resolve(reader.result.split(',')[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            const updatedData = {
                username: inputUsername.value,
                password: inputPassword.value,
                age: inputAge.value,
                image: file ? `data:${file.type};base64,${base64Image}` : data.image,
                note: inputNote.value
            };

            try {
                const res = await fetch(`http://localhost:3000/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });
                if (res.ok) {
                    alert("Cập nhật thành công");
                    getUsers(); // Refresh the user list
                } else {
                    alert("Cập nhật thất bại");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Có lỗi xảy ra");
            }
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
