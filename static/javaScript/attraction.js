const url = window.location.href;
const attractionId = url.substring(url.lastIndexOf('/') + 1);

function fetchAttractionData(attractionId) {
    fetch(`/api/attraction/${attractionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const attractionTitle = document.querySelector('.attraciton-title');
        const attractionCategoryMRT = document.querySelector('.attraction-category-mrt');
        const infoIntro = document.querySelector('.info-intro');
        const infoAddress = document.querySelector('.info-address');
        const infoTraffic = document.querySelector('.info-traffic');
        
        if (data.error) {
          attractionTitle.textContent = 'Error';
          attractionCategoryMRT.textContent = data.message;
        } else {
          attractionTitle.textContent = data.data.name;
          attractionCategoryMRT.textContent = data.data.category;
          infoIntro.textContent = data.data.description;
          infoAddress.textContent = data.data.address;
          infoTraffic.textContent = data.data.transport;
        }
      })
      .catch((error) => {
        console.error('Error fetching attraction data:', error);
      });
  }
  
fetchAttractionData(attractionId);

function check_left() {
  document.getElementById("tourCost").textContent = "新台幣 2000 元";
  document.getElementById("leftIconUnfilled").style.display = "none";
  document.getElementById("leftIconFilled").style.display = "block";
  
  document.getElementById("rightIconUnfilled").style.display = "block";
  document.getElementById("rightIconFilled").style.display = "none";
}

function check_right() {
  document.getElementById("tourCost").textContent = "新台幣 2500 元";
  document.getElementById("rightIconUnfilled").style.display = "none";
  document.getElementById("rightIconFilled").style.display = "block";
  
  document.getElementById("leftIconUnfilled").style.display = "block";
  document.getElementById("leftIconFilled").style.display = "none";
}
