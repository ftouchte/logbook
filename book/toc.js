// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="rg-l.html">RG-L</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="25-04-20.html">25-04-20</a></li><li class="chapter-item expanded affix "><a href="25-04-18.html">25-04-18</a></li><li class="chapter-item expanded affix "><a href="25-04-16.html">25-04-16</a></li><li class="chapter-item expanded affix "><a href="25-04-14.html">25-04-14</a></li><li class="chapter-item expanded affix "><a href="25-04-12.html">25-04-12</a></li><li class="chapter-item expanded affix "><a href="25-04-10.html">25-04-10</a></li><li class="chapter-item expanded affix "><a href="25-04-09.html">25-04-09</a></li><li class="chapter-item expanded affix "><a href="25-04-08.html">25-04-08</a></li><li class="chapter-item expanded affix "><a href="25-04-07.html">25-04-07</a></li><li class="chapter-item expanded affix "><a href="25-04-06.html">25-04-06</a></li><li class="chapter-item expanded affix "><a href="25-04-05.html">25-04-05</a></li><li class="chapter-item expanded affix "><a href="25-04-04.html">25-04-04</a></li><li class="chapter-item expanded affix "><a href="25-04-03.html">25-04-03</a></li><li class="chapter-item expanded affix "><a href="25-04-02.html">25-04-02</a></li><li class="chapter-item expanded affix "><a href="25-04-01.html">25-04-01</a></li><li class="chapter-item expanded affix "><a href="25-03-31.html">25-03-31</a></li><li class="chapter-item expanded affix "><a href="25-03-30.html">25-03-30</a></li><li class="chapter-item expanded affix "><a href="25-03-29.html">25-03-29</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
