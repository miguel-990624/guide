export function loginAuth() {
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formEmail = document.getElementById("email").value.trim();
        const formPassword = document.getElementById("password").value.trim();
        if(!formEmail || !formPassword){
            alert("Please use valid values");
            return;
        }
        fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(users => {
            const user = users.find((u) => u.email === formEmail && u.password === formPassword);

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));

                if(user.role === "admin"){
                    window.location.href = "/src/pages/dashboard.html"
                }else{
                    window.location.href = "/src/pages/public.html";
                }
            }else{
                const errorDiv = document.getElementById("login-error");
                errorDiv.textContent = "Invalid Email or password"
            }
        })
    })
};

export function registerUser() {
    const registerForm = document.getElementById("register-form");
    
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formEmail = document.getElementById("email").value.trim();
        const formPassword = document.getElementById("password").value.trim();
        const formName = document.getElementById("name").value.trim();
        const formNumber = document.getElementById("number").value.trim();
        const formEnrollNumber = document.getElementById("enrollNumber").value.trim();
        const formAdmissionDate = document.getElementById("dateOfAdmission").value.trim();
        if(!formName || !formEmail || !formPassword || !formNumber || !formEnrollNumber || !formAdmissionDate){
            alert("Please use valid values");
            return;
        }
        fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(users => {
            const user = users.find((u) => u.email === formEmail);

            if (!user) {
                const newUser = {
                    name: formName,
                    email: formEmail,
                    password: formPassword,
                    phone: formNumber,
                    enrollNumber: formEnrollNumber,
                    dateOfAdmission: formAdmissionDate,
                    role: "visitor"
                };

                fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                })
                .then(res => res.json())
                .then(savedUser => {
                    localStorage.setItem("currentUser", JSON.stringify(savedUser));
                    window.location.href = "/src/pages/public.html";
                })
                .catch(err => {
                    console.error("Error saving user:", err);
                });

            }else{
                const errorDiv = document.getElementById("login-error");
                errorDiv.textContent = "User already registered"
            }
        })
    })
}

