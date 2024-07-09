document.addEventListener("DOMContentLoaded", function () {
    let toggler = document.getElementById('settings-button');

    toggler.addEventListener("click", () => {
      if (!document.documentElement.classList.contains("lightMode")) {
        document.documentElement.classList.add("lightMode");
      } else {
        document.documentElement.classList.remove("lightMode");
      }
    });
  });