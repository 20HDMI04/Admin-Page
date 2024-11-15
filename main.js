import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//szerver által pontosan viszaadott hibaüzeneteket nem jöttek meg olyan pontossággal csak az jött vissza hogy bad request így csak így oldottam meg.
const URL = "http://localhost:3000/";
const homebtn = document.getElementById("HomeBtn");
async function Init() {
	let res = await fetch(URL + "users");
	let users = await res.json();
	const content = document.getElementById("content");
	const template = document.getElementById("temp");
	for (const e of users) {
		const clone = template.content.cloneNode(true);
		const parentdiv = clone.children[0];
		clone.querySelector("h5").textContent = e.email;
		clone.querySelector("p").textContent = "Age " + e.age;
		clone.querySelector("img").src = URL + `users/${e.id}/profile`;
		clone.querySelectorAll("button")[0].addEventListener("click", async () => {
			let res = await fetch(URL + `users/${e.id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				parentdiv.remove();
			} else {
        const template_suc = document.getElementById("failure");
      const clone = template_suc.content.cloneNode(true);
      clone.querySelector("p").textContent = "Delete error: "+ `${res.status} ${res.statusText}`;
      if (document.body.contains(document.getElementById("div_fai"))) {
        document.getElementById("div_fai").remove();
        document.getElementById("symbol").remove();
      }
      document.getElementById("navtopper").appendChild(clone);
      }
		});
		clone.querySelectorAll("button")[1].addEventListener("click", () => {
			content.innerHTML = "";
			InitEdit(content, e.email, e.age, e.id);
		});
		content.appendChild(clone);
	}
}

async function ContentEditor(inner_age, inner_email, id) {
	const imageInput = document.getElementById("imginput");
	const file = imageInput.files[0];
	const email = document.getElementById("emailedit").value;
	const age = document.getElementById("ageedit").value;
	let resimage = null;
	if (file) {
		const formData = new FormData();
		formData.append("file", file);

		resimage = await fetch(URL + `users/${id}/profile`, {
			method: "PUT",
			body: formData,
			mode: "cors",
			Accept: "application/json",
		});
    if (resimage.ok) {
      const template_suc = document.getElementById("success");
      const clone = template_suc.content.cloneNode(true);
      clone.querySelector("p").textContent = "User edited successfully";
      if (document.body.contains(document.getElementById("div_suc"))) {
        document.getElementById("div_suc").remove();
        document.getElementById("symbol").remove();
      }
      document.getElementById("navtopper").appendChild(clone);
      document.getElementById("content").innerHTML = "";
      Init();
    }
	}

	const data = {
		email: String(email),
		age: Number(age),
	};
	let res = null;
	if (!(email == inner_email && age == inner_age)) {
		res = await fetch(`http://localhost:3000/users/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			mode: "cors",
			body: JSON.stringify(data),
		});
    if (res.ok) {
      const template_suc = document.getElementById("success");
      const clone = template_suc.content.cloneNode(true);
      clone.querySelector("p").textContent = "User edited successfully";
      if (document.body.contains(document.getElementById("div_suc"))) {
        document.getElementById("div_suc").remove();
        document.getElementById("symbol").remove();
      }
      document.getElementById("navtopper").appendChild(clone);
      document.getElementById("content").innerHTML = "";
      Init();
    }
	}
}

async function InitEdit(content, email, age, id) {
	const template = document.getElementById("edittemp");
	const clone = template.content.cloneNode(true);
	const parentdiv = clone.children[0];
	const editpic = clone.querySelector("img");
	editpic.src = URL + `users/${id}/profile`;

	clone.querySelectorAll("input")[0].addEventListener("change", async (e) => {
		/** @type {File} */
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				editpic.src = reader.result;
			},
			false
		);
		if (file) {
			reader.readAsDataURL(file);
		}
	});

	clone.querySelectorAll("input")[1].value = email;
	clone.querySelectorAll("input")[2].value = age;

	const inner_email = email;
	const inner_age = age;
	clone.querySelectorAll("button")[0].addEventListener("click", (e) => {
		e.preventDefault();
		try {
			ContentEditor(inner_age, inner_email, id);
		} catch (err) {
			console.error(err);
		}
	});
	content.appendChild(clone);
}

document.getElementById("createUser").addEventListener("click", AddUser);



async function AddUser() {
	document.getElementById("content").innerHTML = "";
	let template = document.getElementById("createtemp");
	let clone = template.content.cloneNode(true);
	clone.querySelectorAll("input")[0].addEventListener("change", async (e) => {
		/** @type {File} */
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				editpic.src = reader.result;
			},
			false
		);
		if (file) {
			reader.readAsDataURL(file);
		}
	});
	clone.querySelectorAll("button")[0].addEventListener("click", async (e) => {
		e.preventDefault();
		const email = document.getElementById("emailcreate").value;
		const age = document.getElementById("agecreate").value;
		const file = document.getElementById("imginput").files[0];
		const formData = new FormData();
		formData.append("file", file);
		const data = {
			email: String(email),
			age: Number(age),
		};
		let res = await fetch(URL + "users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			Accept: "application/json",
		});
		if (res.ok) {
			let order = await fetch(URL + "users");
			let users = await order.json();
			let id = users[users.length - 1].id;
			if (file) {
				let resimage = await fetch(URL + `users/${id}/profile`, {
					method: "PUT",
					body: formData,
					mode: "cors",
					Accept: "application/json",
				});
			}

      const template_suc = document.getElementById("success");
      const clone = template_suc.content.cloneNode(true);
      clone.querySelector("p").textContent = "User created successfully";
      if (document.body.contains(document.getElementById("div_suc"))) {
        document.getElementById("div_suc").remove();
        document.getElementById("symbol").remove();
      }
      document.getElementById("navtopper").appendChild(clone);
      document.getElementById("content").innerHTML = "";
      Init();
		} else {
      const template_suc = document.getElementById("failure");
      const clone = template_suc.content.cloneNode(true);
      clone.querySelector("p").textContent = "User error: "+ `${res.status} ${res.statusText}`;
      if (document.body.contains(document.getElementById("div_fai"))) {
        document.getElementById("div_fai").remove();
        document.getElementById("symbol").remove();
      }
      document.getElementById("navtopper").appendChild(clone);
    }
	});
	document.getElementById("content").appendChild(clone);
}
document.addEventListener("DOMContentLoaded", Init);
