let firstName = document.querySelector('#first-name');
let logoutBtn = document.querySelector('.logout-btn');
let uploadBtn = document.querySelector('#upload-btn');
let receiptFile = document.querySelector('#receipt');
let uploadMsg = document.querySelector('#upload-message')
let submitBtn = document.querySelector('#submit-btn');
let amountEl = document.querySelector('#amount');
let typeEl = document.querySelector('#type');
let descriptionEl = document.querySelector('#description');
let formEl = document.querySelector('#form');
let submitMsg = document.querySelector('#submit-message');

firstName.innerText = localStorage.getItem('first_name');

let imageUrl;


submitBtn.addEventListener('click', async () => {
    event.preventDefault();
    const URL = `http://localhost:8081/users/${localStorage.getItem('user_id')}/reimbursements`;


    if(isNaN(amountEl.value)){
        submitMsg.innerText='Amount must be a number!';
    }
    const jsonString = JSON.stringify({
        "amount": amountEl.value,
        "type": typeEl.value,
        "description": descriptionEl.value,
        "receipt": imageUrl
    });

    let res = await fetch(URL, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: jsonString,
    })

    if(res.ok){
        formEl.reset();
        submitMsg.innerText='Your submission has been sent!';
        setTimeout(function(){ location.reload(); }, 3000);
    } else {
        let errorMsg = await res.text();
        console.log(errorMsg);
    }
})



uploadBtn.addEventListener('click', async () => {
    uploadBtn.innerText = 'Uploading...';  
    const formData = new FormData();
    
    formData.append('image', receiptFile.files[0]);
    const URL = 'http://localhost:8081/reimbursements/image-upload';

    let res = await fetch(URL, {
        method: 'POST',
        body: formData,
    })

    if (res.ok) {
        imageUrl = res.headers.get('Image');

        uploadBtn.innerText = 'Uploaded!';
        uploadBtn.classList.add('bg-tahiti-blue');
        uploadBtn.classList.remove('bg-metal');
        
    } else {
        let errorMsg = await res.text();
        console.log(errorMsg);
        uploadMsg.innerText = errorMsg;
    }

});


logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_id');
    localStorage.removeItem('first_name');
    window.location = '/public/index.html';
});