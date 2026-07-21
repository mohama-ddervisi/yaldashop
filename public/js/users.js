let users=[];

const tbody=document.getElementById("users-body");

const modal=document.getElementById("modal");

const modalBody=document.getElementById("modal-body");

async function loadUsers(){

const res=await fetch("/users");

users=await res.json();

render(users);

}

function render(data){

tbody.innerHTML="";

data.forEach(user=>{

tbody.innerHTML+=`

<tr>

<td>${user.fullName}</td>

<td>${user.phone}</td>

<td>${user.email||"-"}</td>

<td>${user.orders}</td>

<td>${user.totalSpent.toLocaleString("fa-IR")} تومان</td>

<td>${new Date(user.createdAt).toLocaleDateString("fa-IR")}</td>

<td>

<button
class="view"
data-id="${user.id}">

مشاهده

</button>

</td>

</tr>

`;

});

}

document
.getElementById("search")
.addEventListener("input",e=>{

const value=e.target.value.toLowerCase();

render(

users.filter(user=>

user.fullName.toLowerCase().includes(value)||

user.phone.includes(value)||

(user.email||"").toLowerCase().includes(value)

)

);

});

document.addEventListener("click",async e=>{

if(!e.target.classList.contains("view")) return;

const id=e.target.dataset.id;

const res=await fetch("/users/"+id);

const user=await res.json();

modalBody.innerHTML=`

<h2>${user.fullName}</h2>

<br>

<p>📱 ${user.phone}</p>

<p>📧 ${user.email||"-"}</p>

<p>📦 تعداد سفارش: ${user.orders.length}</p>

<hr><br>

<h3>آخرین سفارش‌ها</h3>

${user.orders.map(order=>`

<div style="margin:10px 0">

#${order.id}

-

${order.total.toLocaleString("fa-IR")} تومان

</div>

`).join("")}

`;

modal.classList.add("active");

});

document
.getElementById("close")
.onclick=()=>{

modal.classList.remove("active");

};

loadUsers();