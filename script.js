const css = `
  .zoomable-image {
    cursor: zoom-in;
  }

  .zoomable-image.zoomed {
    cursor: zoom-out;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  }

  .zoomable-image.zoomed img {
    max-width: 90%;
    max-height: 90%;
  }
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = css;
document.head.appendChild(styleElement);

function loadMarkdown(file) {
  fetch(file)
    .then((response) => response.text())
    .then((markdown) => {
      const md = window.markdownit();
      const result = md.render(markdown);
      const updatedResult = result.replace(
        /<img src="(.*?)"(.*?)>/g,
        (match, src, attributes) => {
          const isMobileImage = src.includes("/mobile/");
          const updatedAttributes = isMobileImage
            ? 'width="250px"'
            : 'width="65%" height="auto"';
          return `<div class="zoomable-image" style="display: flex; justify-content: center;"><img src="${src}" ${updatedAttributes}></div>`;
        }
      );

      document.getElementById("content").innerHTML = updatedResult;
      addZoomFunctionality();
    })
    .catch((error) => {
      console.error("Error loading Markdown file:", error);
    });
}

function addZoomFunctionality() {
  const zoomableImages = document.querySelectorAll(".zoomable-image");

  zoomableImages.forEach((image) => {
    image.addEventListener("click", function () {
      this.classList.toggle("zoomed");
    });
  });
}

function handleMenuItemClick(file) {
  loadMarkdown(file); // Load and render the Markdown file
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.getElementsByClassName("dropdown");
  for (let i = 0; i < dropdowns.length; i++) {
    const dropdown = dropdowns[i];
    const dropbtn = dropdown.querySelector(".dropbtn");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    dropbtn.addEventListener("click", function () {
      dropdown.classList.toggle("active");
      if (dropdown.classList.contains("active")) {
        dropdownContent.style.display = "block";
      } else {
        dropdownContent.style.display = "none";
      }
    });
  }

  loadMarkdown("default.md");
});
