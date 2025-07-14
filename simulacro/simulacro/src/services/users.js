export function loadUser() {
    fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(users => {
            const tableBody = document.getElementById("user-table");
            tableBody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.phone}</td>
                    <td>${user.enrollNumber}</td>
                    <td>${user.dateOfAdmission}</td>
                `;
                const tdRow = document.createElement("td");

                const editBtn = document.createElement("button");
                editBtn.classList.add("edit-user");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", () => {
                    document.getElementById("form-title").textContent = `Edit user: ${user.name}`;
                    document.getElementById("user-id").value = user.id;
                    document.getElementById("name").value = user.name;
                    document.getElementById("email").value = user.email;
                    document.getElementById("password").value = user.password;
                    document.getElementById("number").value = user.phone;
                    document.getElementById("enrollNumber").value = user.enrollNumber;
                    document.getElementById("dateOfAdmission").value = user.dateOfAdmission;
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-user");
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", () => {
                    const userId = user.id;
                    const confirmDelete = confirm(`Are you sure you want to delete ${user.name}?`);
                    if (!confirmDelete) return;

                    fetch(`http://localhost:3000/users/${userId}`, {
                        method: "DELETE"
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Failed to delete user");
                            loadUser();
                        })
                        .catch(err => console.error("Error deleting user:", err));
                });

                tdRow.appendChild(editBtn);
                tdRow.appendChild(deleteBtn);
                row.appendChild(tdRow);
                tableBody.appendChild(row);
            })
        })
        .catch(err => { console.error("Error loading users:", err) });
};

export function handleSubmit() {
    const userForm = document.getElementById("user-form");

    userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formEmail = document.getElementById("email").value.trim();
        const formPassword = document.getElementById("password").value.trim();
        const formName = document.getElementById("name").value.trim();
        const formNumber = document.getElementById("number").value.trim();
        const formEnrollNumber = document.getElementById("enrollNumber").value.trim();
        const formAdmissionDate = document.getElementById("dateOfAdmission").value.trim();
        const formID = document.getElementById("user-id").value.trim();
        if (!formName || !formEmail || !formPassword || !formNumber || !formEnrollNumber || !formAdmissionDate) {
            alert("Please use valid values");
            return;
        }
        const user = {
            name: formName,
            email: formEmail,
            password: formPassword,
            phone: formNumber,
            enrollNumber: formEnrollNumber,
            dateOfAdmission: formAdmissionDate,
            role: "visitor"
        };

        if (formID) {
            fetch(`http://localhost:3000/users/${formID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id : formID,
                    name: formName,
                    email: formEmail,
                    password: formPassword,
                    phone: formNumber,
                    enrollNumber: formEnrollNumber,
                    dateOfAdmission: formAdmissionDate,
                    role: "visitor"
                })
            })
                .then(res => res.json())
                .then(savedUser => {
                    userForm.reset();
                    document.getElementById("form-title").textContent = "Add User";
                    loadUser();

                })
                .catch(err => {
                    console.error("Error saving user:", err);
                });
        } else {
            fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
                .then(res => res.json())
                .then(savedUser => {
                    userForm.reset();
                    document.getElementById("form-title").textContent = "Add User";
                    loadUser();

                })
                .catch(err => {
                    console.error("Error saving user:", err);
                });
        }
    })
}