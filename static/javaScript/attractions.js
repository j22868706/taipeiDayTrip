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
         
          performAttractionSearch();
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

let nextPage = 0;
let isLoading = false;
let keyword ="";

function appendDataToPage(data) {
  const attractionsContainer = document.getElementById('attractions-container');

  if (data && data.length > 0) {
    data.forEach((attraction) => {
      const attractionDiv = document.createElement('div');
      attractionDiv.classList.add('attraction');

      const imgElement = document.createElement('img');
      imgElement.src = attraction.images[0];
      imgElement.alt = attraction.name;
      imgElement.classList.add('attraction-img');
      attractionDiv.appendChild(imgElement);

      const textElement1 = document.createElement('div');
      textElement1.textContent = attraction.name;
      textElement1.classList.add('opacity', 'attraction-name');
      attractionDiv.appendChild(textElement1);

      const imageBottom = document.createElement('div');
      imageBottom.classList.add('image-bottom');
      attractionDiv.appendChild(imageBottom);

      const textElement2 = document.createElement('div');
      textElement2.textContent = attraction.mrt;
      textElement2.classList.add('mrt-name');
      imageBottom.appendChild(textElement2);

      const textElement3 = document.createElement('div');
      textElement3.textContent = attraction.category;
      textElement3.classList.add('category');
      imageBottom.appendChild(textElement3);

      attractionsContainer.appendChild(attractionDiv);
    });
  }
}

function setupInfiniteScroll() {
  window.addEventListener("scroll", () => {
    if (isLoading || nextPage === null) {
      return;
    }

    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollY >= documentHeight) {
      isLoading = true;

      fetch(`/api/attractions?keyword=${keyword}&page=${nextPage}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.nextPage) {
            nextPage = data.nextPage;
          } else {
            nextPage = null;
          }
          appendDataToPage(data.data);

          isLoading = false;
        })
        .catch((error) => {
          console.error("錯誤", error);
          isLoading = false;
        });
    }
  });
}

function fetchAttractions() {
  fetch('/api/attractions')
    .then((response) => response.json())
    .then((data) => {
          const attractionsContainer = document.getElementById('attractions-container');
      
      if (data.data && data.data.length > 0) {
        data.data.forEach((attraction) => {
          const attractionDiv = document.createElement('div');
          attractionDiv.classList.add('attraction');

          const imgElement = document.createElement('img');
          imgElement.src = attraction.images[0];
          imgElement.alt = attraction.name;
          imgElement.classList.add('attraction-img');
          attractionDiv.appendChild(imgElement);

          const textElement1 = document.createElement('div');
          textElement1.textContent = attraction.name;
          textElement1.classList.add('opacity', 'attraction-name');
          attractionDiv.appendChild(textElement1);

          const imageBottom = document.createElement('div');
          imageBottom.classList.add('image-bottom');
          attractionDiv.appendChild(imageBottom);

          const textElement2 = document.createElement('div');
          textElement2.textContent = attraction.mrt;
          textElement2.classList.add('mrt-name');
          imageBottom.appendChild(textElement2);

          const textElement3 = document.createElement('div');
          textElement3.textContent = attraction.category;
          textElement3.classList.add('category');
          imageBottom.appendChild(textElement3);

          attractionsContainer.appendChild(attractionDiv);
        });
      } else {
        const noDataElement = document.createElement('p');
        noDataElement.textContent = '沒有找到相關景點';
        attractionsContainer.appendChild(noDataElement);
      }
      nextPage = data.nextPage;
    })
    .catch((error) => {
      console.error('獲取景點失敗：', error);
    });
}

window.onload = function () {
  fetchAttractions();
  setupInfiniteScroll(); 
};

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
            if (data.error) {
              attractionsContainer.innerHTML = `An error occurred: ${data.message}`;
            } else if (data.data && data.data.length > 0) {
              data.data.forEach((attraction) => {
                appendDataToPage(attraction);
              });

              nextPage = data.nextPage;

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

      loadMoreData(); 
    }

    function appendDataToPage(attraction) {
      const attractionDiv = document.createElement("div");
      attractionDiv.classList.add("attraction");

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

    searchButton.addEventListener("click", initializePage);
  });
}

setupAttractionSearch();