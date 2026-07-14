const modal =
document.getElementById("discount-modal");

const openBtn =
document.getElementById("add-discount");

const form =
document.getElementById("discount-form");

const tbody =
document.getElementById("discounts-table");

/* ===========================
      Load Discounts
=========================== */

async function loadDiscounts(){

    const res = await fetch("/discounts");

    const data = await res.json();

    if(!data.success) return;

    tbody.innerHTML = "";

    data.discounts.forEach(discount=>{

        tbody.innerHTML += `

<tr>

<td>${discount.code}</td>

<td>

${discount.type==="percent"
?"درصدی"
:"مبلغ ثابت"}

</td>

<td>

${discount.value}

${discount.type==="percent"
?"%"
:"تومان"}

</td>

<td>

${discount.minPurchase
?discount.minPurchase.toLocaleString()
:"-"}

</td>

<td>

${discount.usedCount}

/

${discount.usageLimit ?? "∞"}

</td>

<td>

${discount.isActive

?'<span style="color:green">فعال</span>'

:'<span style="color:red">غیرفعال</span>'}

</td>

<td>

<button>

ویرایش

</button>

</td>

</tr>

`;

    });

}

loadDiscounts();

/* ===========================
      Open Modal
=========================== */

openBtn.onclick = ()=>{

    form.reset();

    modal.classList.add("active");

};

/* ===========================
      Close Modal
=========================== */

window.onclick=(e)=>{

    if(e.target===modal){

        modal.classList.remove("active");

    }

};

/* ===========================
      Submit
=========================== */

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const formData =
    new FormData(form);

    const body =
    Object.fromEntries(formData.entries());

    const res =
    await fetch("/discounts",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(body)

    });

    const data =
    await res.json();

    if(data.success){

        alert("کد تخفیف اضافه شد");

        modal.classList.remove("active");

        loadDiscounts();

    }else{

        alert(data.message);

    }

});