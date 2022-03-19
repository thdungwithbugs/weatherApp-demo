const APP_ID = "186b22dae331f10ddecb74042eeac746";
const searchInput = document.querySelector("#search-input");
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");

const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");

document.querySelector("#search-input").addEventListener("change", (event) => {
  // console.log(event);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${event.target.value}&appid=${APP_ID}&units=metric&lang=vi`
  ).then(async (data) => {
    const result = await data.json();
    console.log(result);
    cityName.innerHTML = result.name || "--";
    weatherState.innerHTML = result.weather[0].description || "--";
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
    ) || "--";
    temperature.innerHTML = Math.round(result.main.temp) || "--";
    sunrise.innerHTML = moment.unix(result.sys.sunrise).format("H:mm") || "--";
    sunset.innerHTML = moment.unix(result.sys.sunset).format("H:mm") || "--";
    humidity.innerHTML = result.main.humidity || "--";
    windSpeed.innerHTML = (result.wind.speed * 3.6).toFixed(2) || "--";
    speak(
      `Thời tiết ở ${
        result.name
      } đã được hiển thị, nhiệt độ hiện tại khoảng ${Math.round(
        result.main.temp
      )} độ C`
    );
  });
});

//Xử lý trợ lý ảo = voice
SpeechSynthesisUtterance.rate = 8;
let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "vi-VI"; //Nhận diện voice tiếng Việt
recognition.continuous = false; //API trả về kết quả/lỗi sau khi kết thúc voice
const synth = window.speechSynthesis;
const speak = (text) => {
  if (synth.speaking) {
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.onend = () => {
    console.log("Completed.");
  };
  utter.onerror = (error) => {
    console.log("Error of SpeechSynthesisUtterance", error);
  };
  synth.speak(utter);
};
const microphone = document.querySelector(".microphone");
microphone.classList.remove("recording");
const handleVoice = (voice) => {
  //Check thông tin
  console.log("Địa danh được gọi: ", voice);
  //Hiển thị thông tin địa danh lên giao diện
  if (voice.toLowerCase().includes("thời tiết ở")) {
    const place = voice.toLowerCase().split("ở")[1].trim();
    searchInput.value = place;
    const changeEvent = new Event("change");
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  //Tác vụ xử lý giờ
  if (voice.toLowerCase().includes("mấy giờ")) {
    const textToSpeech = `Thời gian hiện tại là ${moment().hours()} giờ ${moment().minutes()} phút`;
    console.log(textToSpeech);
    textToSpeech.rate = 0.1;
    speak(textToSpeech);
    return;
  }
  if (
    voice.toLowerCase().includes("chào") ||
    voice.toLowerCase().includes("tên gì")
  ) {
    const textToSpeech =
      "Xin chào bạn, tôi là trợ lý ảo được Hoàng Dũng lập trình đơn giản bằng J S, rất vui được trò chuyện với bạn";
    speak(textToSpeech);
    return;
  }
  if (
    voice.toLowerCase().includes("tắt") ||
    voice.toLowerCase().includes("dừng") ||
    voice.toLowerCase().includes("ngừng") ||
    voice.toLowerCase().includes("ngưng") ||
    voice.toLowerCase().includes("stop")
  ) {
    document.querySelector("audio").pause();
    return;
  }
  if (voice.toLowerCase().includes("nhạc")) {
    document.querySelector("audio").play();
    speak("Hy vọng bài nhạc bình yên này sẽ giúp bạn thư giãn và yêu đời hơn");
    return;
  }
  if (voice.toLowerCase().includes("khỏe")) {
    speak("Hôm nay tôi khỏe, cảm ơn bạn");
    return;
  }
  speak("rất tiếc tôi chưa học được việc này");
};
microphone.addEventListener("click", (event) => {
  //Tránh load page
  event.preventDefault();
  //Lần đầu tiên, hỏi truy cập microphone vào trình duyệt
  recognition.start();
  microphone.classList.add("recording");
});

//Sau khi hoàn thành sự kiện, dừng hành động
recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove("recording");
};
//Xử lý khi có lỗi xảy ra
recognition.onerror = (err) => {
  console.log("onerror", err);
  microphone.classList.remove("recording");
};
//Xử lý khi có kết quả trả về từ API
recognition.onresult = (data) => {
  console.log("onresult", data);
  //Trả về địa danh được gọi API
  const place = data.results[0][0].transcript;
  handleVoice(place);
};

// chrome.exe --autoplay-policy=no-user-gesture-required;
