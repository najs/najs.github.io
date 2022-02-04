let im;

function check() {
	if (im) {
		im.destroy();
	}
	const titleElement = document.querySelector("h1");
	const progressElement = document.querySelector(".progress");
	const backgroundElement = document.querySelector(".background .wrapper");
	const fragment = document.createDocumentFragment();
	const imgs = backgroundElement.getElementsByTagName("img");
	const totalCount = imgs.length;

	titleElement.innerHTML = "Are you Ready?";
	progressElement.innerHTML = "0%";
	//backgroundElement.innerHTML = "";

	/*for (let i = 0; i < totalCount; ++i) {
		const img = document.createElement("img");
		img.style.opacity = 1;

		fragment.appendChild(img);
	}
	backgroundElement.appendChild(fragment);*/



	im = new eg.ImReady();

	let count = 0;

	setTimeout(
		function insert() {
			// https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg
			imgs[count].style.opacity = 1;
			//imgs[count].src = `https://naver.github.io/egjs-infinitegrid/assets/image/${count + 1}.jpg`;

			if (++count >= totalCount) {
				document.querySelector(".container").style.opacity = 0;
				return;
			}
			setTimeout(insert, 100);
	}, 100);
	im.check(document.querySelectorAll("img")).on("readyElement", e => {
		progressElement.innerHTML = `${Math.floor(e.readyCount / e.totalCount * 100)}%`;
	}).on("ready", e => {
		titleElement.innerHTML = "I'm Ready!";

	});

}

check();
