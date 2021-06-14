const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = user => {
  if (user) {
    loggedInLinks.forEach(link => link.style.display = "block");
    loggedOutLinks.forEach(link => link.style.display = "none");
  } else {
    loggedInLinks.forEach(link => link.style.display = "none");
    loggedOutLinks.forEach(link => link.style.display = "block");
  }
}

// SignUp
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector('#signup-email').value;
  const password = document.querySelector('#signup-password').value;

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // clear the form
      signupForm.reset();
      // close the modal
      $("#signupModal").modal("hide")

      console.log('sign up')
    })
});

// SingIn
const signinForm = document.querySelector("#login-form");

signinForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  // Authenticate the User
  auth
  .signInWithEmailAndPassword(email, password)
  .then(userCredential => {
    // clear the form
    signupForm.reset();
    // close the modal
    $("#signinModal").modal("hide")

    console.log('sign in')
  })
});

// Logout
const logout = document.querySelector("#logout");

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('sign out')
  })
}); 

// Login with Google
const googleButton = document.querySelector("#googleLogin");
googleButton.addEventListener("click", e => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
  .then(result => {
    console.log('google sign in');
    //clear the form
    signupForm.reset();
    //close the modal
    $('#signinModal').modal('hide')
  })
  .catch(err => {
    console.log(err);
  })
});

// Login with Facebook
const facebookButton = document.querySelector("#facebookLogin");

facebookButton.addEventListener('click', e => {
  e.preventDefault();
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
  .then(result => {
    console.log(result);
    console.log("facebook sign in")
  })
  .catch(err => {
    console.log(err);
  })

});

// Posts
const postList = document.querySelector(".posts");
const setupPosts = data => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const post = doc.data();
      const li = `
      <li class="list-group-item list-group-item-action">
        <h5>${post.title}</h5>
        <p>${post.description}</p>
      </li>
    `;
      html += li;
    });
    postList.innerHTML = html;
  } else {
    //postList.innerHTML = '<p class="text-center">¡Ingresa para conecernos más!</p>';
    //postList.innerHTML = "<span style='color: green; text-align: center;displayblock;'>¡Ingresa para conecernos más!</span>";
    postList.innerHTML = "<span style='color: white; text-align: center;displayblock;'>¡Ingresa para conecernos más!</span>";
  }
}

// events
//si sale o entra el usuario se lanza esta funcion
//el snapshot va cambiando las imagenes o los textos al actualizar
// list for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
      fs.collection("posts")
        .get()
        .then((snapshot) => {
          setupPosts(snapshot.docs)
          loginCheck(user);
        })
    } else {
      setupPosts([])
      loginCheck(user);
    }
  })