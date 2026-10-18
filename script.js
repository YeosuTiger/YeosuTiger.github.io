// Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const btnSearch = document.getElementById('btn-search');
const btnLucky = document.getElementById('btn-lucky');
const quoteDisplay = document.getElementById('quote-display');
const weatherSeoul = document.getElementById('weather-seoul');
const weatherJeju = document.getElementById('weather-jeju');

// Search Form Handling
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  performSearch();
});

function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  } else {
    searchInput.focus();
  }
}

// "I'm Feeling Lucky" button
btnLucky.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=I`;
  } else {
    window.location.href = 'https://www.google.com/doodles';
  }
});

// Clear Button logic
searchInput.addEventListener('input', () => {
  if (searchInput.value.length > 0) {
    clearBtn.classList.add('active');
  } else {
    clearBtn.classList.remove('active');
  }
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.remove('active');
  searchInput.focus();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // ESC clears search
  if (e.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.value = '';
    clearBtn.classList.remove('active');
  }
  // Slash '/' to focus search input if not already focused
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// Quote Rotation on Click
const quotes = [
  { text: "하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다.", author: "사무엘존슨" },
  { text: "천 리 길도 한 걸음부터.", author: "노자" },
  { text: "시작이 반이다.", author: "한국 속담" },
  { text: "배움에는 끝이 없다.", author: "SDU 서울디지털대학교" },
  { text: "미래는 오늘 당신이 무엇을 하는가에 달려 있다.", author: "마하트마 간디" },
  { text: "작은 일에 최선을 다하면 큰일도 이룰 수 있다.", author: "공자" }
];

let currentQuoteIndex = 0;

quoteDisplay.addEventListener('click', () => {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  quoteDisplay.style.opacity = '0';
  setTimeout(() => {
    quoteDisplay.innerHTML = `&ldquo;${quotes[currentQuoteIndex].text}&rdquo; - ${quotes[currentQuoteIndex].author}`;
    quoteDisplay.style.opacity = '1';
  }, 200);
});

// Weather API interpretation (WMO weather codes)
function getWeatherDesc(code) {
  if (code === 0) return { desc: '맑음', icon: '☀️' };
  if (code === 1 || code === 2) return { desc: '대체로 맑음', icon: '🌤️' };
  if (code === 3) return { desc: '흐림', icon: '☁️' };
  if ([45, 48].includes(code)) return { desc: '안개', icon: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { desc: '비', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { desc: '눈', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { desc: '뇌우', icon: '⛈️' };
  return { desc: '구름 많음', icon: '⛅' };
}

// Optional Live Weather fetch on badge click
async function fetchLiveWeather(city, lat, lon, element) {
  try {
    element.style.opacity = '0.6';
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    const temp = data.current_weather.temperature.toFixed(1);
    const weatherInfo = getWeatherDesc(data.current_weather.weathercode);
    
    element.querySelector('.weather-text').innerHTML = `${city}: <span class="temp">${temp}°C</span> <span class="condition">${weatherInfo.desc}</span>`;
    element.querySelector('.weather-icon').textContent = weatherInfo.icon;
  } catch (err) {
    console.log('Live weather fetch error:', err);
  } finally {
    element.style.opacity = '1';
  }
}

weatherSeoul.addEventListener('click', () => {
  fetchLiveWeather('서울', 37.5665, 126.9780, weatherSeoul);
});

weatherJeju.addEventListener('click', () => {
  fetchLiveWeather('제주', 33.4996, 126.5312, weatherJeju);
});
