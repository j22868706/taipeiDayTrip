function fetchMrts() {
  fetch('/api/mrts')
    .then((response) => response.json())
    .then((data) => {
      const ul = document.getElementById('mrt-stations');
      
      data.data.forEach((station) => {
        const li = document.createElement('li');
        li.textContent = station; 
        ul.appendChild(li);

        li.addEventListener('click', function () {

          const searchInput = document.getElementById('search-input');
          searchInput.value = station;
          const searchButton = document.getElementById('search-button');
          searchButton.click();         
        });
      });
    })
    .catch((error) => {
      console.error('無法顯示：', error);
    });
}
window.onload = fetchMrts;

fetchMrts();

function leftScroll() {
  const listContent = document.getElementById('mrt-stations');
  const scrollAmount = listContent.offsetWidth; 
  listContent.scrollLeft -= scrollAmount; 
}

function rightScroll() {
  const listContent = document.getElementById('mrt-stations');
  const scrollAmount = listContent.offsetWidth;
  listContent.scrollLeft += scrollAmount; 
}

function setupAttractionSearch() {
  document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const attractionsContainer = document.getElementById("attractions-container");
    let nextPage = 0;
    let isLoading = false;
    let keyword = "";

    function loadMoreData() {
      if (nextPage !== null && !isLoading) {
        isLoading = true;
    
        fetch(`/api/attractions?keyword=${keyword}&page=${nextPage}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.data && data.data.length > 0) {
              data.data.forEach((attraction) => {
                appendDataToPage(attraction);
              });
    
              nextPage = data.nextPage;
    
              isLoading = false;
            } else if (data === null || data.data === null) {
                window.alert("查無景點");
                isLoading = false;
            } else {
              nextPage = null;
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            isLoading = false;
          });
      }
    }
    
function initializePage() {
  attractionsContainer.innerHTML = "";
  nextPage = 0;
  keyword = searchInput.value;

  setupScrollListener();
  loadMoreData();
}

function setupScrollListener() {
  window.addEventListener("scroll", function () {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      nextPage !== null &&
      !isLoading
    ) {
      loadMoreData();
    }
  });
}

function appendDataToPage(attraction) {
  const attractionDiv = document.createElement("div");
  attractionDiv.classList.add("attraction");

  attractionDiv.onclick = function() {
    const attractionId = attraction.id;
    window.location.href = `/attraction/${attractionId}`;
  };
  
    if (attraction.images && attraction.images.length > 0) {
    const imgElement = document.createElement("img");
    imgElement.src = attraction.images[0];
    imgElement.alt = attraction.name;
    imgElement.classList.add("attraction-img");
    attractionDiv.appendChild(imgElement);
}
    
  const textElement1 = document.createElement("div");
  textElement1.textContent = attraction.name;
  textElement1.classList.add("opacity", "attraction-name");
  attractionDiv.appendChild(textElement1);
    
  const imageBottom = document.createElement("div");
  imageBottom.classList.add("image-bottom");
  attractionDiv.appendChild(imageBottom);
    
  const textElement2 = document.createElement("div");
  textElement2.textContent = attraction.mrt;
  textElement2.classList.add("mrt-name");
  imageBottom.appendChild(textElement2);
    
  const textElement3 = document.createElement("div");
  textElement3.textContent = attraction.category;
  textElement3.classList.add("category");
  imageBottom.appendChild(textElement3);
  
  attractionsContainer.appendChild(attractionDiv);

}

window.onload = function () {
  initializePage();
  setupScrollListener(); 
}

searchButton.addEventListener("click", initializePage);
  });
}

setupAttractionSearch();

