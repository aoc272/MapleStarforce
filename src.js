window.onload = () => {

	Array.prototype.last = function() {
		return this[this.length - 1];
	};

	String.prototype.extractLatter = function() {
		return this.split("→").last().split(",").join("");
	};

	const round = (x, precision) => Math.round(x * (10 ** precision)) / (10 ** precision);
	const safeguard = () => safeguardCheckBox.checked && 12 <= star && star < 17;

	let star,chance,totalUse,totalDestroy;
	const [maxstar,aliveColor,deadColor] = [25,"#99b721","#bbd366"];

	const success = [95,90,85,85,80,75,70,65,60,55,50,45,40,35,30,30,30,30,30,30,30,30,3,2,1];
	const destroy = [0,0,0,0,0,0,0,0,0,0,0,0,0.6,1.3,1.4,2.1,2.1,2.1,2.8,2.8,7,7,19.4,29.4,39.6];
	const fail = Array.from(Array(25).keys()).map(v => 100 - success[v] - destroy[v]);
	const meso = [321000,641000,961000,1281000,1601000,1921000,2241000,2561000,2881000,3201000,12966500,16400100,20356300,24865300,29956500,71316500,83999600,98016700,113422300,130270000,148612400,168501500,189988600,213124000,237957700];

	const visualStar = document.querySelector("#visual-star");
	const message = document.querySelector("#message");
	const information = document.querySelector("#information");
	const catchCheckBox = document.querySelector("#catch-checkbox");
	const safeguardCheckBox = document.querySelector("#safeguard-checkbox");
	const mesoText = document.querySelector("#meso-text");
	const enchantButton = document.querySelector("#enchant-button");
	const resetButton = document.querySelector("#reset-button");

	function updateStarChanceTotalUse() {
		if (chance === 2 || Math.random() * 100 < (success[star] + (catchCheckBox.checked ? 4.5 : 0))) {
			chance = 0;
			star += 1;
		} else if (!safeguard() && Math.random() < destroy[star] / (100 - success[star])) {
			chance = 0;
			star = 12;
			totalDestroy += 1;
		} else if (star <= 10 || star % 5 === 0) {
			chance = 0;
		} else {
			chance += 1;
			star -= 1;
		}

		totalUse += Number(mesoText.innerHTML.extractLatter());
	}

	function updateVisualStar() {
		let [i,result] = [1,""];
		for (; i <= star; ++i) {
			result += "★";
			if (i === 5 || i === 10 || i === 20) {
				result += " ";
			} else if (i === 15) {
				result += "<br>";
			}
		}
		for (; i <= maxstar; ++i) {
			result += "☆";
			if (i === 5 || i === 10 || i === 20) {
				result += " ";
			} else if (i === 15) {
				result += "<br>";
			}
		}

		visualStar.innerHTML = result;
	}

	function updateMessage() {
		let result;
		if (star >= maxstar) {
			result = "장비가 한계까지 강화되어 더 이상 강화할 수 없습니다.";
		} else if (chance === 2) {
			result = "CHANCE TIME!!";
		} else if (star <= 10) {
			result = "메소를 사용하여 장비를 강화합니다.";
		} else {
			switch (star) {
				case 11:
				result = "실패 시 강화 단계가 하락됩니다."; break;
				case 12: case 13: case 14:
				result = safeguard() ? "실패 시 강화 단계가 하락됩니다." : "실패 시 장비가 파괴되거나 강화 단계가 하락될 수 있습니다."; break;
				case 15:
				result = safeguard() ? "메소를 사용하여 장비를 강화합니다." : "실패 시 장비가 파괴될 수 있습니다."; break;
				case 16:
				result = safeguard() ? "실패 시 강화 단계가 하락됩니다." : "실패 시 장비가 파괴되거나 강화 단계가 하락될 수 있습니다."; break;
				case 20:
				result = "실패 시 장비가 파괴될 수 있습니다."; break;
				default:
				result = "실패 시 장비가 파괴되거나 강화 단계가 하락될 수 있습니다.";
			}
		}

		message.innerHTML = result;
	}

	function updateInformation() {
		let result = `${star}성> ${star + 1}성`;
		result += "<br>성공확률: ";
		if (star >= maxstar) {
			result = `${maxstar}성`;
		} else if (chance === 2) {
			result += `100.0%`;
		} else {
			const type = star <= 10 || star % 5 === 0 ? "유지" : "하락";
			result += `${success[star].toFixed(1)}%`;
			result += `<br>실패(${type})확률: ${fail[star].toFixed(1)}%`;
			if (destroy[star] > 0) {
				result += `<br>파괴확률: ${destroy[star].toFixed(1)}%`;
			}
		}

		result += `<br>누적메소: ${totalUse.toLocaleString("en")}`;
		result += `<br>누적파괴횟수: ${totalDestroy.toLocaleString("en")}`;

		information.innerHTML = result;
	}

	function updateAccessibility() {
		if (star >= maxstar) {
			safeguardCheckBox.checked = false;

			catchCheckBox.disabled = true;
			catchCheckBox.checked = false;

			enchantButton.disabled = true;
			enchantButton.style.backgroundColor = deadColor;
		}

		safeguardCheckBox.disabled = star >= maxstar || chance === 2 || star < 12 || star >= 17;
	}

	function updateMesoText() {
		if (star >= maxstar) {
			mesoText.innerHTML = "";
		} else if (chance !== 2 && safeguard()) {
			mesoText.innerHTML = meso[star].toLocaleString("en");
			mesoText.innerHTML += "→" + (meso[star] * 2).toLocaleString("en");
		} else {
			mesoText.innerHTML = meso[star].toLocaleString("en");
		}
	}

	function setEventListener() {
		safeguardCheckBox.addEventListener("change", safeguardEvent);
		enchantButton.addEventListener("click", enchantEvent);
		resetButton.addEventListener("click", resetEvent);
		enchantButton.focus();
	}

	function safeguardEvent() {
		updateMessage();
		updateMesoText();
	}

	function enchantEvent() {
		updateStarChanceTotalUse();
		updateVisualStar();
		updateMessage();
		updateInformation();
		updateAccessibility();
		updateMesoText();
	}

	function resetEvent() {
		[star,chance,totalUse,totalDestroy] = [0,0,0,0];

		catchCheckBox.disabled = false;
		catchCheckBox.checked = false;

		safeguardCheckBox.disabled = true;
		safeguardCheckBox.checked = false;

		enchantButton.disabled = false;
		enchantButton.style.backgroundColor = aliveColor;

		updateVisualStar();
		updateMessage();
		updateInformation();
		updateMesoText();
	}

	function init() {
		setEventListener();
		resetEvent();
	}

	init();

};