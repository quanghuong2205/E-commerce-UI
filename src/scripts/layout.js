const qs = document.querySelector.bind(document);
const qsa = document.querySelectorAll.bind(document);
const qsp = (parent, childSelector) => parent.querySelector(childSelector);
const assignEvent = (node, event, handler) => node.addEventListener(event, handler);

import debounce from "./utils/debounce.js";
import elemIsHidden from "./utils/elemIsHidden.js";

/**
 *  Set up the position of arrow icon when
 *     hovering the element in the navbar
 */
(function () {
  const setUpArrowPos = debounce(() => {
    const navMenu = qs(".nav-with-dropdown");

    /* Element is hidden or device is not PC */
    if (elemIsHidden(navMenu) || window.innerWidth <= 991.8) return;

    const navItems = qsa(".nav-with-dropdown > li");

    /**
     * Get the information about item
     *   (width, height, coordinate, ...)
     */
    const getItemInfor = (elem) => {
      return {
        left: elem.offsetLeft,
        width: elem.offsetWidth,
      };
    };

    /**
     *  Loop through each element in navbar
     *   and calculate postion for arrow icon
     */
    const navItemIterator = Array.prototype.forEach.bind(navItems);

    /* Func to calculate the position of arrow */
    const calulateArrowPos = (navItem) => {
      /* Get the information about item */
      const { left: navItemLeft, width: navItemWidth } = getItemInfor(navItem);

      /* Calculate the width of arrow icon
         Arrow icon is hidden when not hovering, so use getComputedStyle to
           extract its width (use offsetwidth will get 0 - as it is hidden)
      */
      const arrow = qsp(navItem, ".arrow");
      let arrowWidth = window.getComputedStyle(arrow).width;
      arrowWidth = parseInt(arrowWidth.slice(0, arrowWidth.indexOf("px") + 1));

      /* Calculae final position for the arrow icon */
      const leftPos = navItemLeft + navItemWidth / 2 - arrowWidth / 2;
      navItem.style.setProperty("--arrow-left-pos", `${leftPos}px`);
    };

    navItemIterator(calulateArrowPos);
  }, 500);

  setUpArrowPos();
  window.addEventListener("resize", setUpArrowPos);
})();

/**
 * Activate (open/close) the category menu
 *  when clicking on Mobile or
 *  hovering navbar item on Desktop
 */
(function () {
  const navItems = qsa(".nav-item");
  const activeClass = "cat-item--active";

  /* referece to save current active item */
  let curActiveItem = undefined;

  /* Hanlde activate item */
  const handleActivate = (item) => {
    /* Handle un activate item */
    const handleUnActivate = () => {
      curActiveItem?.classList?.remove(activeClass);
    };

    /* Handle activate on PC */
    assignEvent(item, "mouseenter", () => {
      if (window.innerWidth <= 991.8) return;
      handleUnActivate();
      item.classList.add(activeClass);
      curActiveItem = item;
    });

    /* Handle activate on Mobile and Tablet */
    assignEvent(item, "click", () => {
      if (window.innerWidth > 991.8) return;

      /* Item has been active */
      if (item === curActiveItem) {
        item.classList.toggle(activeClass);
        return;
      }

      /* Unactivate active item then activate target item */
      handleUnActivate();
      item.classList.add(activeClass);
      item.scrollIntoView();
      curActiveItem = item;
    });
  };

  /*Loop through each menu*/
  Array.from(navItems).forEach((navItem) => {
    const catMenu = qsp(navItem, ".cat-menu");
    const catItems = catMenu.children;

    /* No children to deal with */
    if (catItems.length == 0) return;

    /* Handle activate each cat-item */
    Array.from(catItems).forEach(handleActivate);

    /* Activate first cat-item when move to nav-item
        by default (just in PC)
    */
    assignEvent(navItem, "mouseenter", () => {
      if (window.innerWidth > 991.8) {
        qsp(catMenu, `.${activeClass}`)?.classList?.remove(activeClass);
      }

      if (window.innerWidth <= 991.8) return;

      catItems[0].classList.add(activeClass);
      curActiveItem = catItems[0];
    });
  });
})();

/**
 * Toggle class on target element when clicking
 *   on it
 */
(function () {
  const toggleElems = qsa(".toggle");
  /* Save selector of tagret elems has been handled to 
       close when click outside of it 
  */
  const handledTargetsWhenClickOutside = [];

  /* Click outside of target elem will remove toggle class on it */
  const handleToggleWhenClickOutside = (e, targetElem, toggledTargetSelector, toggledClass) => {
    if (e.target.closest(toggledTargetSelector) || e.target.closest(".toggle")) return;

    const isToggled = targetElem.classList.contains(toggledClass);

    if (isToggled) {
      targetElem.classList.remove(toggledClass);
    }
  };

  /* Handle to toggle class on target element */
  const handleToggle = (toggledTargetSelector, toggledClass) => {
    const targetElem = qs(toggledTargetSelector);

    /* Tagret elem not found */
    if (!targetElem) {
      alert(`Not found target element (selector ${toggledTargetSelector})`);
      return;
    }

    /* Toggle class not found */
    if (!toggledClass) {
      alert(`Not found toggle class for (selector ${toggledTargetSelector})`);
      return;
    }

    /* Toggle class on target elem */
    targetElem.classList.toggle(toggledClass);

    /* Click outside target*/
    if (!handledTargetsWhenClickOutside.includes(toggledTargetSelector)) {
      /** setTimeOut to make sure this event only assigned
       *    after the handleToggle events finished.
       *  If not then this event will be assigned and
       *    triggered immediately
       */
      setTimeout(() => {
        assignEvent(document, "click", (e) => {
          handleToggleWhenClickOutside(e, targetElem, toggledTargetSelector, toggledClass);
        });
      });

      handledTargetsWhenClickOutside.push(toggledTargetSelector);
    }
  };

  const setUp = (toggleElem) => {
    /* selectors of target element (will be toggled) 
        + toggle class for each 
    */
    const toggledTargetSelectors = toggleElem.dataset.toggleTargets?.split(" ");
    const toggledClasses = toggleElem.dataset.toggleClasses?.split(" ");

    /* No target to toggle */
    if (!toggledTargetSelectors) {
      alert(`Use toggle for ${toggleElem} but no toggle targets are found`);
      return;
    }

    /* No toggle classes */
    if (!toggledClasses) {
      alert(`Use toggle for ${toggleElem} but no toggle classes are found`);
      return;
    }

    /* Loop through each target and toggle class on it */
    const onClick = (e) => {
      e.preventDefault();

      for (let i = 0; i < toggledTargetSelectors.length; i++) {
        const toggledTargetSelector = toggledTargetSelectors[i];
        const toggledClass = toggledClasses[i];
        handleToggle(toggledTargetSelector, toggledClass);
      }
    };

    assignEvent(toggleElem, "click", onClick);
  };

  Array.from(toggleElems).forEach(setUp);
})();

/**
 * Toggle Category menu when clicking navbar item
 *   on Mobile
 */
(function () {
  const navLinks = qsa(".nav-menu .nav-item .nav-link");
  Array.from(navLinks).forEach((navLink) => {
    assignEvent(navLink, "click", () => {
      const navItem = navLink.closest(".nav-item");
      navItem.classList.toggle("nav-item--active");
    });
  });
})();
