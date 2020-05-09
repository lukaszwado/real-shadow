const nodes = document.querySelectorAll('[data-TrueLit]')

const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const getWindowScrollY = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
}

const isInViewport =  (el) => {
    const bounding = el.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const getElementOffset = (el) => {
    const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = getWindowScrollY();
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const lightPosition = { y: vh/3, x: vw/4 }
const DEFAULT_SHADOW_MULTIPLIER = 5

const light = document.querySelector('.light')

const setLightPosition = (e) => {
  lightPosition.x = e?.clientX ?? vw/4
  lightPosition.y = e?.clientY ?? vh/3
  light.style.top = `${lightPosition.y}px`
  light.style.left = `${lightPosition.x}px`
}

document.addEventListener('click' , (e) => {
  setLightPosition(e)
  setShadow()
})

const setShadow = () => {
  nodes.forEach((el) => {
    if(!isInViewport(el)) {
      return
    }
    const elementOffsetTop = getElementOffset(el).top
    const lightPositionRelativeToScroll = lightPosition.y + getWindowScrollY()
    const elementDistanceFromTheLightSource = elementOffsetTop - lightPositionRelativeToScroll
    const elevation = (8 + Number(el.dataset.truelit)) / 10
    const shadowOffsetY = DEFAULT_SHADOW_MULTIPLIER * elementDistanceFromTheLightSource * elevation / 100
    const shadowOffsetX = Math.abs(-(lightPosition.x - shadowOffsetY)/ lightPosition.x) + 10
    const shadowDensity = Math.min(Math.max(Math.abs(10 / shadowOffsetY * 0.1), .25), .3)
    el.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY }px 10px 1px rgba(0,0,0,${shadowDensity})`
    el.style.transform = `scale(${elevation})`
    el.style.zIndex = `${elevation}`
  })
}

setShadow()
setLightPosition()

window.addEventListener('scroll', setShadow)
