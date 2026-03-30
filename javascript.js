function setCookie(cname,cvalue)
{
let d=new Date()
d.setHours(d.getHours()+1)

document.cookie=cname+"="+cvalue+";expires="+d.toUTCString()+";path=/"
}

function getCookie(cname)
{
let name=cname+"="
let decodedCookie=decodeURIComponent(document.cookie)
let ca=decodedCookie.split(';')

for(let i=0;i<ca.length;i++)
{
let c=ca[i].trim()

if(c.indexOf(name)==0)
{
return c.substring(name.length,c.length)
}
}

return ""
}



function createCartContainer(username)
{

let cartHTML=`
<div id="flexContainer">

<h2>Welcome, ${username}</h2>

<div id="cartItems"></div>

<div id="buttons">

<button class="btn btn-success"
onclick="checkOut()">Check-Out</button>

<button class="btn btn-danger"
onclick="clearCart()">Clear Cart</button>

</div>

</div>
`

document.getElementById("flexOutput").innerHTML=cartHTML
}



function addToCart(item_id,item_name,imgSrc,price)
{

let username=getCookie("username")

if(username==="")
{

let uname=prompt("Introduce Yourself")

if(uname===null || uname==="") return

setCookie("username",uname)

username=uname

createCartContainer(username)

localStorage.setItem("productsArray","")

}

if(!document.getElementById("flexContainer"))
{
createCartContainer(username)
}



let prodString = localStorage.getItem("productsArray")
let priceString = localStorage.getItem("prices")
let imgString = localStorage.getItem("imgSrcs")

let prodArr = prodString && prodString!=="" ? prodString.split(",") : []
let priceArr = priceString && priceString!=="" ? priceString.split(",") : []
let imgArr = imgString && imgString!=="" ? imgString.split(",") : []



let index = prodArr.indexOf(String(item_id))

if(index !== -1)
{
let qtyInput=document.getElementById("i"+item_id)

if(qtyInput)
{
qtyInput.value=parseInt(qtyInput.value)+1
populateQuantity()
}

return
}



prodArr.push(item_id)
priceArr.push(price)
imgArr.push(imgSrc)

localStorage.setItem("productsArray",prodArr.join(","))
localStorage.setItem("prices",priceArr.join(","))
localStorage.setItem("imgSrcs",imgArr.join(","))



let itemHTML=`
<div id="${item_id}">

<label>Item:</label>
<span style="margin-left:20px;">${item_name}</span><br>

<label>Quantity:</label>
<input type="number"
id="i${item_id}"
value="1"
style="margin-left:10px;text-align:center;"
onchange="populateQuantity()"><br>

<label>Price:</label>
<span style="margin-left:80px;">₹${price}</span>

<hr>

<button class="btn btn-danger rounded-circle"
onclick="removeItem(${item_id})">
<i class="bi bi-trash"></i>
</button>

</div>
`

document.getElementById("cartItems")
.insertAdjacentHTML("beforeend",itemHTML)

localStorage.setItem(
"finalHTML",
document.getElementById("flexOutput").innerHTML
)

populateQuantity()

}



function populateQuantity()
{

let prodString=localStorage.getItem("productsArray")

if(prodString===null || prodString==="") return

let prodArray=prodString.split(",")

let qtyArray=[]

for(let i=0;i<prodArray.length;i++)
{

let input=document.getElementById("i"+prodArray[i])

if(input)
{
qtyArray.push(input.value)
}

}

localStorage.setItem("qty",qtyArray.join(","))

}



function removeItem(id)
{

let element=document.getElementById(id)

if(element)
{
element.remove()
}

let prodString=localStorage.getItem("productsArray")

if(prodString!==null)
{

let arr=prodString.split(",")

arr=arr.filter(x=>x!=id)

localStorage.setItem("productsArray",arr.join(","))
}

localStorage.setItem(
"finalHTML",
document.getElementById("flexOutput").innerHTML
)

}



function clearCart()
{

localStorage.removeItem("productsArray")
localStorage.removeItem("qty")
localStorage.removeItem("finalHTML")
localStorage.removeItem("prices")
localStorage.removeItem("imgSrcs")

document.getElementById("flexOutput").innerHTML=""

}



function checkOut()
{

let productsString = localStorage.getItem("productsArray");
let qtyString = localStorage.getItem("qty");
let priceString = localStorage.getItem("prices");
let imgString = localStorage.getItem("imgSrcs");

if(!productsString || !qtyString || !priceString || !imgString)
{
alert("Cart is empty!");
return;
}

let products = productsString.split(",");
let qty = qtyString.split(",");
let prices = priceString.split(",");
let imgs = imgString.split(",");

let grandTotal = 0;

let billHTML = `
<div id="billBox">
<h2>Your Final Bill</h2>

<table>
<tr>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
<th>Total</th>
</tr>
`;

for(let i=0;i<products.length;i++)
{

let q = parseInt(qty[i] || 0);
let p = parseInt(prices[i] || 0);

let total = q * p;

grandTotal += total;

billHTML += `
<tr>
<td><img src="${imgs[i] || ''}" width="60"></td>
<td>${q}</td>
<td>₹${p}</td>
<td>₹${total}</td>
</tr>
`;
}

billHTML += `
<tr>
<td colspan="3"><b>Grand Total</b></td>
<td><b>₹${grandTotal}</b></td>
</tr>
</table>

<br>

<button onclick="closeBill()">Back</button>
<button onclick="proceedPayment(${grandTotal})">Proceed To Pay</button>
<div id="bankInfo"></div>

</div>
`;

document.getElementById("flexOutput").insertAdjacentHTML("beforeend",billHTML);

}


function closeBill()
{
let box = document.getElementById("billBox");
if(box) box.remove();
}



function displayItems(filter_id)
{

fetch("data.json")
.then((response)=>response.json())
.then((myObject)=>{

for(let k in myObject)
{

if(myObject[k].filter_id===filter_id)
{

let arr=myObject[k].products

let productHTML=""

for(let j in arr)
{
productHTML+=displayProduct(arr[j])
}

let myRow=document.querySelectorAll(".myRow")

for(let o=0;o<myRow.length;o++)
{
myRow[o].innerHTML=""
}

myRow[0].innerHTML=productHTML



myRow[0].style.display="flex"
myRow[0].style.color="aquva"
myRow[0].style.flexDirection="row"
myRow[0].style.justifyContent="space-around"
myRow[0].style.alignContent="space-around"
myRow[0].style.flexWrap="wrap"
myRow[0].style.padding="10px"
myRow[0].style.paddingTop="0px"
myRow[0].style.height="auto"
myRow[0].style.border="2px solid black"
myRow[0].style.backgroundColor="lightgray"



let myBlocks=document.querySelectorAll(".myRow div")

for(let i=0;i<myBlocks.length;i++)
{

myBlocks[i].style.width="400px"
myBlocks[i].style.height="300px"
myBlocks[i].style.textAlign="center"
myBlocks[i].style.borderRadius="3%"
myBlocks[i].style.border="2px solid black"
myBlocks[i].style.marginTop="10px"
myBlocks[i].style.backgroundColor="skyblue"



}

let myImages=document.querySelectorAll(".myRow img")

for(let m=0;m<myImages.length;m++)
{

myImages[m].style.width="170px"
myImages[m].style.height="170px"

}

let mySpan=document.querySelectorAll(".myRow span")

for(let n=0;n<mySpan.length;n++)
{

mySpan[n].style.float="left"
mySpan[n].style.color="red"
mySpan[n].style.margin="6px auto auto 10px"

}

let myCartButton=document.querySelectorAll(".myRow button")

for(let j=0;j<myCartButton.length;j++)
{

myCartButton[j].style.borderRadius="20px"
myCartButton[j].style.margin="auto 10px auto auto"

}

}

}

})

}



function displayProduct(product)
{

return `
<div id="p${product.product_id}">

<h2>${product.product_name}</h2>

<img src="${product.imgSrc}">

<hr>

<span>₹${product.price}</span>

<button class="btn btn-info"
onclick="addToCart(${product.product_id},
'${product.product_name}',
'${product.imgSrc}',
${product.price})">

Add to Cart

</button>

</div>
`
}


function restoreCart()
{

let username=getCookie("username")

if(username==="") return

let savedHTML=localStorage.getItem("finalHTML")

if(savedHTML!==null && savedHTML!=="")
{
document.getElementById("flexOutput").innerHTML=savedHTML
}

}

window.onload=function()
{
restoreCart()
}

function proceedPayment(total)
{
	let cardDiv=`<img src="image/locker.jpeg">`
	cardDiv+=`<H4 style="margin:10px auto auto auto">TOTAL PAYMENT:₹${total}</H4>`
	
	cardDiv+=`<div style="width:auto;margin:auto;"><div style="float:left;margin:10px auto auto auto;"><label>Card Number:</label><input type="text" style="width:50px;text-align:center;" maxlength="4">-<input type="text" style="width:50px;text-align:center;" maxlength="4">-<input type="text" style="width:50px;text-align:center;" maxlength="4">-<input type="text" style="width:50px;text-align:center;" maxlength="4"></div>`
	cardDiv+=`<div style="margin:10px 10px auto auto;float:right;">CVV/CVV2:<input type="password" style="appearance:none;padding-left:15px;width:70px;background-image:url('../images/lock.jpeg');background-size:15px auto;background-position:1px 5px;background-repeat:no-repeat;" maxlength="3"></div></div>`
	cardDiv+=`<div style="margin:10px auto auto 27px;clear:left;"><label>Expiry Year:</label><input type="text" style="width:40px;text-align:center;margin-top:10px;" maxlength="2">/<input type="text" style="width:40px;text-align:center;margin-top:10px;" maxlength="2"></div><hr style="margin:0px;padding:0px;">`
	cardDiv+=`<button class="btn btn-success" onclick="paymentSuccessfull()" style="float:right;margin-right:15px;">Confirm payment</button>`
	document.getElementById("bankInfo").innerHTML=cardDiv
	
	
	
	$("#bankInfo").slideDown(3000)
	}

    function paymentSuccessfull()
{
alert("Payment Successful! 🎉")

clearCart()

closeBill()
}