const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

function lineAnimation(element, thisEle) {
    element.style.left = thisEle.offsetLeft + "px";
    element.style.width = thisEle.offsetWidth + "px";
}
// SonDN fixed - Active size wrong size on first load.
// Original post: https://www.facebook.com/groups/649972919142215/?multi_permalinks=1175881616551340
requestIdleCallback(function () {
    lineAnimation(line, tabActive);
});

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");

        // line.style.left = this.offsetLeft + "px";
        // line.style.width = this.offsetWidth + "px";
        lineAnimation(line, this)
        this.classList.add("active");
        pane.classList.add("active");
    };
});