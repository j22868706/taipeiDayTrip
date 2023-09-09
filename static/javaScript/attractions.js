function fetchMrts() {
  fetch('/api/mrts')
    .then((response) => response.json())
    .then((data) => {
      const ul = document.getElementById('mrt-stations');

      data.data.forEach((station) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#'; // 在这里设置适当的链接
        a.textContent = station; // 将站名设置为锚标签的文本内容
        li.appendChild(a);
        ul.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('获取捷运站失败：', error);
    });
}

fetchMrts();
function leftScroll() {
  const listContent = document.getElementById('mrt-stations');
  const scrollAmount = listContent.offsetWidth; // 使用列表元素的宽度作为滚动距离
  listContent.scrollLeft -= scrollAmount; // 向左滚动一页
}

function rightScroll() {
  const listContent = document.getElementById('mrt-stations');
  const scrollAmount = listContent.offsetWidth; // 使用列表元素的宽度作为滚动距离
  listContent.scrollLeft += scrollAmount; // 向右滚动一页
}


function fetchMrts() {
  fetch('/api/mrts')
    .then((response) => response.json())
    .then((data) => {
      const ul = document.getElementById('mrt-stations');
      ul.innerHTML = '';

      data.data.forEach((station) => {
        const li = document.createElement('li');
        li.textContent = station;
        ul.appendChild(li);

        // 为每个站点名称添加事件监听器
        li.addEventListener('click', function () {
          // 将选定的站名填入搜索输入框
          const searchInput = document.getElementById('search-input');
          searchInput.value = station;

          // 触发搜索（您可能希望重用搜索函数）
          performAttractionSearch();
        });
      });
    })
    .catch((error) => {
      console.error('失败：', error);
    });
}
window.onload = fetchMrts;


// 假设以下的全局变量是已经定义好的
let nextPage = 1; // 用于记录下一页的页数
let isLoading = false; // 用于控制加载状态

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
        noDataElement.textContent = '没有找到相关景点';
        attractionsContainer.appendChild(noDataElement);
      }
    })
    .catch((error) => {
      console.error('获取景点失败：', error);
    });
}

// 1. 第一次加载后，记录API返回的nextPage信息
// 这可以在页面加载完成时或其他适当的时机进行
// nextPage可以从你的API响应中获取

// 2. 监听页面滚动事件
window.addEventListener('scroll', () => {
  // 如果已经在加载中，或者没有下一页数据可加载，就不执行加载操作
  if (isLoading || nextPage === null) {
    return;
  }

  // 获取页面的高度和滚动位置
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;
  const documentHeight = document.documentElement.scrollHeight;

  // 当滚动到页面底部时加载下一页数据
  if (windowHeight + scrollY >= documentHeight) {
    // 防止连续加载
    isLoading = true;

    // 3. 调用API加载下一页数据
    fetch(`/api/attractions?page=${nextPage}`)
      .then((response) => response.json())
      .then((data) => {
        // 4. 处理API返回的数据，将景点信息添加到页面底部
        if (data.nextPage) {
          // 如果有下一页数据，更新nextPage变量
          nextPage = data.nextPage;
        } else {
          // 如果没有下一页数据，设置nextPage为null，停止加载
          nextPage = null;
        }

        // 处理并添加新数据到页面
        appendDataToPage(data.data);

        isLoading = false; // 重置加载状态
      })
      .catch((error) => {
        console.error('Error loading next page', error);
        isLoading = false; // 处理错误时也要重置加载状态
      });
  }
});

// 4. 将景点信息添加到页面底部的函数
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

window.onload = function () {
  fetchAttractions(); // 第一次加载数据
};

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const attractionsContainer = document.getElementById("attractions-container");
  const nextPageButton = document.getElementById("next-page-button"); // Add a button for loading the next page
  let currentPage = 0; // Track the current page

  // Function to fetch attractions
  function fetchAttractions(page) {
      const keyword = searchInput.value;

      fetch(`/api/attractions?keyword=${keyword}&page=${page}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  attractionsContainer.innerHTML = `An error occurred: ${data.message}`;
                  return;
              }

              if (data.data && data.data.length > 0) {
                  data.data.forEach(attraction => {
                      // Create attraction elements as you did before
                      
                      attractionsContainer.appendChild(attractionDiv);
                  });

                  // Check if there's a next page
                  if (data.nextPage !== null) {
                      currentPage++; // Increment the current page
                      nextPageButton.style.display = "block"; // Show the "Load More" button
                  } else {
                      nextPageButton.style.display = "none"; // Hide the button if there's no next page
                  }
              } else {
                  attractionsContainer.innerHTML = "No results found.";
              }
          })
          .catch(error => {
              console.error("Error:", error);
              attractionsContainer.innerHTML = "An error occurred while fetching data.";
          });
  }

  // Event listener for the "Search" button
  searchButton.addEventListener("click", function () {
      attractionsContainer.innerHTML = ""; // Clear previous results
      currentPage = 0; // Reset the current page
      fetchAttractions(currentPage); // Fetch the first page
  });

  // Event listener for the "Load More" button
  nextPageButton.addEventListener("click", function () {
      fetchAttractions(currentPage + 1); // Fetch the next page
  });
});

