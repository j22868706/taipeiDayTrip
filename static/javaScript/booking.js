function loginBlock() {
  const loginForm = document.querySelector('.login-form');
  const registrationForm = document.querySelector(".registration-form");
  const loginClass = document.querySelector(".login-class")
  
  loginClass.style.display = "block";
  loginForm.style.display = 'block';
  registrationForm.style.display = "none";
}

function closeLoginForm() {
  const loginForm = document.querySelector('.login-form');
  const loginClass = document.querySelector(".login-class")
  loginClass.style.display = "none";
  loginForm.style.display = 'none';
}

function closeRegistForm() {
  const registrationForm = document.querySelector('.registration-form');
  const loginClass = document.querySelector(".login-class")
    
  loginClass.style.display = "none";
  registrationForm.style.display = 'none';
}

function switchToRegist() {
  const loginForm = document.querySelector('.login-form');
  const registrationForm = document.querySelector('.registration-form');

  loginForm.style.display = 'none';
  registrationForm.style.display = 'block';
}

function switchToLogin() {
  const loginForm = document.querySelector('.login-form');
  const registrationForm = document.querySelector('.registration-form');

  loginForm.style.display = 'block';
  registrationForm.style.display = 'none';
}

function submitSignupForm(signupEvent) {
  signupEvent.preventDefault();

  const signupNameInput = document.getElementById("signupName");
  const signupEmailInput = document.getElementById("signupEmail");
  const signupPasswordInput = document.getElementById("signupPassword");

  if (signupNameInput.value === "" || signupEmailInput.value === "" || signupPasswordInput.value === "") {
      const messageBox = document.querySelector(".message-box");
      messageBox.style.display = "block";
      messageBox.textContent = "註冊失敗，有些欄位還沒填寫喔！";
  } else {
      fetch("/api/user", {
          method: "POST",
          body: new FormData(document.getElementById("signupForm")),
      })
      .then((response) => response.json())
      .then((data) => {
          const messageBox = document.querySelector(".message-box");
          messageBox.textContent = data.message;

          if (data.error) {
              messageBox.style.color = "red";
              messageBox.style.display = "block";
          } else {
              messageBox.style.backgroundColor = "white";
              messageBox.style.color = "green";
              messageBox.style.display = "block";
          }
      })
      .catch((error) => {
          console.error("Error:", error);
      });
  }
}

function submitSigninForm(signinEvent) {
  signinEvent.preventDefault();

  const signinEmailInput = document.getElementById("signinEmail");
  const signinPasswordInput = document.getElementById("signinPassword");

  if (signinEmailInput.value === "" || signinPasswordInput.value === "") {
      const signinMessageBox = document.querySelector(".signin-message-box");
      signinMessageBox.style.display = "block";
      signinMessageBox.textContent = "登入失敗，有些欄位還沒填寫喔！";
  } else {
      fetch("/api/user/auth", {
          method: "PUT",
          body: new FormData(document.getElementById("signinForm")),
      })
      .then((response) => response.json())
      .then((data) => {
          const signinMessageBox = document.querySelector(".signin-message-box");
          if (data.error) {
              signinMessageBox.style.color = "red";
              signinMessageBox.style.display = "block";
              signinMessageBox.textContent = data.message;
          } else {
              localStorage.setItem("token", data.token);
              const isLoggedIn = true;
              if (isLoggedIn) {
                window.location.reload();
              }
          }
      })
      .catch((error) => {
          console.error("Error:", error);
      });
  }
}

window.addEventListener('load', checkUserStatus);

function checkUserStatus() {
  const token = localStorage.getItem("token");
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {}; 
  fetch('/api/user/auth', {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('请求失败');
      }
    })
    .then(data => {
      const loginLink = document.getElementById('login-link');
      const logoutLink = document.getElementById('logout-link');
      const usernamePlaceholder = document.getElementById("usernamePlaceholder");

      if (data && data.data !== null) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        usernamePlaceholder.textContent = data.data.name; 
      } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('獲取用戶時出現錯誤：', error);
    });
}

function logoutBlock() {
  localStorage.removeItem("token");  
  window.location.reload();
}

function returnIndex(){
  window.location.href = `/`;
}

document.addEventListener("DOMContentLoaded", function () {
const token = localStorage.getItem("token");
const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};
if (!token) {
      returnIndex();
}
else
fetch("/api/booking", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        ...headers
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
    const contactInfo = document.getElementById('contact-info');
    const paymentInfo = document.getElementById("payment-info");
    const payandcheck = document.getElementById("confirm-and-payment")
    const lineOne = document.getElementById("lineOne")
    const lineTwo = document.getElementById("lineTwo")
    const lineThree = document.getElementById("lineThree")
    const totalfee = document.getElementById("total-cost")
    const noReservation = document.getElementById('no-reservation')
    const attractionTitle = document.getElementById("attractionTitle")
    const attractionTime = document.getElementById("attractionTime")
    const attractionPrice = document.getElementById("attractiondPrice")
    const attractionAddress = document.getElementById("attractiondAddress")
    const attractionDate = document.getElementById("attractionDate")
    const attractionImg = document.getElementById("img")
    const section = document.getElementById("section")


    if (data && data.data !== null) {
      contactInfo.style.display = 'block';
      paymentInfo.style.display = 'block';
      payandcheck.style.display = 'block';
      noReservation.style.display = 'none'
      totalfee.textContent = data.data.price;
      attractionTitle.textContent = data.data.attraction.name;
      attractionDate.textContent = data.data.date;
      attractionTime.textContent = data.data.time; 
      attractionPrice.textContent = data.data.price; 
      attractionAddress.textContent = data.data.attraction.address;
      attractionImg.src = data.data.attraction.images; 

    } else {
      contactInfo.style.display = 'none';
      paymentInfo.style.display = 'none';
      payandcheck.style.display = 'none';
      lineOne.style.display = 'none';
      lineTwo.style.display = 'none';
      lineThree.style.display = 'none';
      section.style.display = 'none';
    }
})
.catch(error => {
    console.error("Error fetching data:", error);
});
});

function bookingButton(){
const token = localStorage.getItem("token");
if (!token) {
  loginBlock();
}
else
window.location.href = "/booking";
}

function deleteBooking() {
const token = localStorage.getItem("token");
const headers = token ? { Authorization: `Bearer ${token}` } : {};

fetch("/api/booking", {
  method: "DELETE",
  headers: headers,
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    if (data.ok) {
      window.location.reload();
    } else {
      console.error("刪除預定失敗");
    }
  })
  .catch((error) => {
    console.error("發生錯誤:", error);
  });
}
