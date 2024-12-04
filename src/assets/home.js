function myFunction() {
    var x = document.getElementById("myDIV");
    
    // If the element is currently hidden
    if (x.style.display === "none") {
      // Show the element
      x.style.display = "block";
    } else {
      // Delay for 1 second, then hide the element
      setTimeout(function() {
        x.style.display = "none";
      }, 1000); // 1000 milliseconds = 1 second
    }
  }


$(document).ready(function () {
    $.ajax({
        url: 'MenuHandler.ashx',
        method: 'get',
        dataType: 'json',
        success: function (data) {
            buildMenu($('#menu'), data);
            // $('#menu').menu();
        }
    });

    function buildMenu(parent, item) {
        $.each(item, function () {
            var li;
            var target
            if (this.isOpenParent) {
                target = "_blank";
            }
            else {
                target = "";
            }


            if (this.List && this.List.length > 0) {

                if (this.linkType == "4")
                    li = $('<li class="nav-item"><a class="nav-link dropdown-toggle"  href=' + this.linkSource + ' target=' + target + '>' + this.linkText + ' </a></li>');
                else
                    li = $('<li class="nav-item"><a class="nav-link dropdown-toggle"  href=' + this.FriendlyURL + '>' + this.linkText + ' </a></li>');

                li.addClass('nav-item dropdown');
                li.appendTo(parent);

                var ul = $('<ul></ul>');
                ul.addClass('dropdown-menu');
                ul.appendTo(li);
                buildMenu(ul, this.List);
            }
            else {
                if (this.linkType == "4")
                    li = $('<li class="nav-item"><a class="nav-link" href=' + this.linkSource + ' target=' + target + '>' + this.linkText + '</a></li>');
                else
                    li = $('<li class="nav-item"><a class="nav-link" href=' + this.FriendlyURL + '>' + this.linkText + '</a></li>');

                li.addClass('nav-item dropdown');
                li.appendTo(parent);
            }
        });
    }
});


$(document).ready(function () {
    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
});

AOS.init({
    duration: 1200,
})
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'G-17CT7C7ZTD');

$("#iribbon-title").click(function () {
    var $self = $(this).find("span");
    $(".ribbon-hide").slideToggle("slow", function () {
        $self.toggleClass('arrow-up arrow-down');
  });
})


