refreshTag(document.currentScript.getAttribute('slotId'), document.currentScript.getAttribute('refreshTime'), refreshInterval = document.currentScript.getAttribute('refreshInterval'), false);
function refreshTag(id, refresh_time, interval, isRefresh) {
    var clickTrack = document.getElementById(id).getAttribute("clicktrack");
  try {
    var refererUrl = document.referrer;
  } catch (e) {

  }
  var title = "";
  try {
    title = document.getElementsByTagName("title")[0].innerHTML;
  } catch (e) {

  }

  var commonWords_array = ["and", "or", "for", "the", "but", "etc", "in", "from", "the", "this", "that", "these", "those", "a", "with", "all", "how", "to", "at", "by", "&amp;", "yes", "no", "do", "I", "i", "an", "of", "more", "less", "safeframe", "container"];
  title = title.toLowerCase().trim();
  var keywords_array = title.split(' ');
  var i;
  var keywords = [];
  for (i = 0; i < keywords_array.length; i++) {
    if (!commonWords_array.includes(keywords_array[i])) {
      keyword = keywords_array[i].replace(/[^\w\s]/gi, '');
      if (keyword != "") {
        keywords.push(keyword);
      }
    }
  }

  var keywordsStr = keywords.toString();


  var pixfuture_frame = id + "_mainframe";
  var pixfuture_ad_width = id.split('x')[1];
  var pixfuture_ad_height = id.split('x')[2];

  if ((pixfuture_ad_width == 728) && (pixfuture_ad_height == 90)) {
    document.getElementById(id).style.width="728px";
    // add class attribute to manage multiple ads banners
    document.getElementById(id).setAttribute('class', 'pixfuture_responsive_banners');

    // creating the style element
    let style = document.createElement('style');

    // assigning the type
    style.type = 'text/css';

    // insert the css rules into style element
    style.innerHTML = `

        @media only screen and (min-width: 700px) and (max-width: 728px)  {
            .pixfuture_responsive_banners {
                transform: scale(0.9);
                -webkit-transform: scale(0.9);
                --moz-transform: scale(0.9);
                -o-transform: scale(0.9);
                -ms-transform: scale(0.9);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 671px) and (max-width: 699px) {
            .pixfuture_responsive_banners {
                transform: scale(0.9);
                -webkit-transform: scale(0.9);
                --moz-transform: scale(0.9);
                -o-transform: scale(0.9);
                -ms-transform: scale(0.9);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 651px) and (max-width: 670px) {
            .pixfuture_responsive_banners {
                transform: scale(0.88);
                -webkit-transform: scale(0.88);
                --moz-transform: scale(0.88);
                -o-transform: scale(0.88);
                -ms-transform: scale(0.88);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 631px) and (max-width: 650px) {
            .pixfuture_responsive_banners {
                transform: scale(0.85);
                -webkit-transform: scale(0.85);
                --moz-transform: scale(0.85);
                -o-transform: scale(0.85);
                -ms-transform: scale(0.85);
                transform-origin: 0 0;
            }
        }


        @media all and (min-width: 601px) and (max-width: 630px) {
            .pixfuture_responsive_banners {
                transform: scale(0.8);
                -webkit-transform: scale(0.8);
                --moz-transform: scale(0.8);
                -o-transform: scale(0.8);
                -ms-transform: scale(0.8);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 560px) and (max-width: 600px) {
            .pixfuture_responsive_banners {
                transform: scale(0.75);
                -webkit-transform: scale(0.75);
                --moz-transform: scale(0.75);
                -o-transform: scale(0.75);
                -ms-transform: scale(0.75);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 520px) and (max-width: 559px) {
            .pixfuture_responsive_banners {
                transform: scale(0.7);
                -webkit-transform: scale(0.7);
                --moz-transform: scale(0.7);
                -o-transform: scale(0.7);
                -ms-transform: scale(0.7);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 491px) and (max-width: 519px) {
            .pixfuture_responsive_banners {
                transform: scale(0.65);
                -webkit-transform: scale(0.65);
                --moz-transform: scale(0.65);
                -o-transform: scale(0.65);
                -ms-transform: scale(0.65);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 451px) and (max-width: 490px) {
            .pixfuture_responsive_banners {
                transform: scale(0.6);
                -webkit-transform: scale(0.6);
                --moz-transform: scale(0.6);
                -o-transform: scale(0.6);
                -ms-transform: scale(0.6);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 401px) and (max-width: 450px) {
            .pixfuture_responsive_banners {
                transform: scale(0.55);
                -webkit-transform: scale(0.55);
                --moz-transform: scale(0.55);
                -o-transform: scale(0.55);
                -ms-transform: scale(0.55);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 371px) and (max-width: 400px) {
            .pixfuture_responsive_banners {
                transform: scale(0.5);
                -webkit-transform: scale(0.5);
                --moz-transform: scale(0.5);
                -o-transform: scale(0.5);
                -ms-transform: scale(0.5);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 341px) and (max-width: 370px) {
            .pixfuture_responsive_banners {
                transform: scale(0.46);
                -webkit-transform: scale(0.46);
                --moz-transform: scale(0.46);
                -o-transform: scale(0.46);
                -ms-transform: scale(0.46);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 301px) and (max-width: 340px) {
            .pixfuture_responsive_banners {
                transform: scale(0.4);
                -webkit-transform: scale(0.4);
                --moz-transform: scale(0.4);
                -o-transform: scale(0.4);
                -ms-transform: scale(0.4);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 250px) and (max-width: 300px) {
            .pixfuture_responsive_banners {
                transform: scale(0.35);
                -webkit-transform: scale(0.35);
                --moz-transform: scale(0.35);
                -o-transform: scale(0.35);
                -ms-transform: scale(0.35);
                transform-origin: 0 0;
            }
        }

        @media all and (min-width: 150px) and (max-width: 250px) {
            .pixfuture_responsive_banners {
                transform: scale(0.22);
                -webkit-transform: scale(0.22);
                --moz-transform: scale(0.22);
                -o-transform: scale(0.22);
                -ms-transform: scale(0.22);
                transform-origin: 0 0;
            }
        }
  `;

    // add the style tag to the head of html
    document.head.appendChild(style);
  }

  var i = 0;
if(window.innerWidth < 767 && (pixfuture_ad_width == 970 && pixfuture_ad_height == 250)){
    document.getElementById(id).style.maxWidth = "300px";
    document.getElementById(id).style.maxHeight = "250px";
    document.getElementById(id).style.display = "contents";
}else{
    document.getElementById(id).style.maxWidth = id.split("x")[1] + "px";
    document.getElementById(id).style.maxHeight = id.split("x")[2] + "px";
}

  if (refresh_time > 5) {
    refresh_time = 5;
  }
  if (interval > 360) {
    interval = 360;
  } else if (interval < 60) {
    interval = 60;
  }
  var time_out = interval * 1000;
  
if(window.innerWidth < 767 && (pixfuture_ad_width == 970 && pixfuture_ad_height == 250)){
    document.getElementById(id).innerHTML = '<iframe id="' + pixfuture_frame + '" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" width="300" height="250"></iframe>';
}else{
    document.getElementById(id).innerHTML = '<iframe id="' + pixfuture_frame + '" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" width="' + pixfuture_ad_width + '" height="' + pixfuture_ad_height + '"></iframe>';
}
  document.getElementById(pixfuture_frame).contentWindow.document.write('<html><head></head><body><div id="' + id + '" clickTrack="'+clickTrack+'"><\/div><script type="text/javascript" async src="//served-by.pixfuture.com/www/delivery/headerbid_refresh_alex.php?dat=' + id + '&keywords=' + keywordsStr + '&refUrl=' + refererUrl + '&refresh=' + isRefresh + '&innerWidth=' + window.innerWidth + '"><\/script><\/body><\/html>');
  document.getElementById(pixfuture_frame).contentWindow.document.close();
  if (i < refresh_time) {
    refresh_time = refresh_time - 1;
    setTimeout(function () {
      refreshTag(id, refresh_time, interval, true);
    }, time_out);
  }

}
