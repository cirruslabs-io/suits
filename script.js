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
          return `<img src="${src}" ${updatedAttributes}>`;
        }
      );

      document.getElementById("content").innerHTML = updatedResult;
    })
    .catch((error) => {
      console.error("Error loading Markdown file:", error);
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
