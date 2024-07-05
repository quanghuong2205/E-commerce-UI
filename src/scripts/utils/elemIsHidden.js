/**
 *  Check if an element node is hidden or visible
 */

const elemIsHidden = (elem) => {
  if (!elem) return true;

  /**
   * Check whether element is none
   */
  const displayIsNone = (node = elem) => {
    let elemStyles = window.getComputedStyle(elem);
    return elemStyles.display == "none";
  };

  /* Stop once identified elem is none */
  if (displayIsNone(elem)) return true;

  /**
   * Keep go up to parent of element util reach root
   *   or hidden element
   */
  let parentOfElem = elem.parentElement;
  while (parentOfElem) {
    if (displayIsNone(parentOfElem)) return true;

    parentOfElem = parentOfElem.parentElement;
  }
};

export default elemIsHidden;
