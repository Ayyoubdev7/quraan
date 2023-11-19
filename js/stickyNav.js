const navBar = document.querySelector("nav");
const header = document.querySelector("header");

const callback = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  const isIntersecting = entry.isIntersecting;
  if (!isIntersecting) {
    navBar.classList.add(
      "stickyNavBar",
      "transition",
      "animated-element-fadeInDown"
    );
  } else {
    navBar.classList.add("transition");
    navBar.classList.remove("stickyNavBar", "animated-element-fadeInDown");
  }
};

const navObserver = new IntersectionObserver(callback, {
  root: null,
  threshold: 0,
});

navObserver.observe(header);
