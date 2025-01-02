async function request(path, options = null) {
	const url = `${import.meta.env.VITE_API_ENDPOINT}${path}`;
	const response = await fetch(url, options);
	return response.json();
}

export function getToDoLists() {
	return request("/todo-lists");
}

export function postToDoList(todoList) {
	return request("/todo-lists", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todoList),
	});
}